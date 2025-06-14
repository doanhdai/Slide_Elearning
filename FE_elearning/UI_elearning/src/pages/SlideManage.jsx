import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Play,
  Save,
  Plus,
  ChevronLeft,
  ChevronRight,
  Monitor,
  X,
} from "lucide-react";
import RightSidebar from "../components/ManageSlide/RightSidebar";
import CreateLectureModal from "../components/Lecture/CreateLectureModal";
import { useSearchParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import {
  getSlideById,
  createSlides,
  updateSlides,
  deleteSlide as deleteSlideService,
} from "../services/slideService";
import { useParams, useNavigate } from "react-router-dom";

const SlideManage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "edit";
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [deletedSlideIds, setDeletedSlideIds] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(null);
  const [lectureTitle, setLectureTitle] = useState("");
  const [showHTMLModal, setShowHTMLModal] = useState(false);
  const [tempHTMLContent, setTempHTMLContent] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [thumbnailsVisible, setThumbnailsVisible] = useState(true);
  const [isPresenting, setIsPresenting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const IframeSlideRenderer = React.memo(
    ({ htmlContent, slideId, style = {} }) => {
      const iframeRef = React.useRef(null);

      React.useEffect(() => {
        if (iframeRef.current && htmlContent) {
          const iframe = iframeRef.current;

          // Tạo HTML document hoàn chỉnh
          const fullHTML = `
          <!DOCTYPE html>
          <html lang="vi">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Slide ${slideId}</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                overflow: hidden;
                width: 100vw;
                height: 100vh;
              }
              * {
                box-sizing: border-box;
              }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
          </html>
        `;

          // Gán HTML vào iframe
          iframe.srcdoc = fullHTML;
        }
      }, [htmlContent, slideId]);

      return (
        <iframe
          ref={iframeRef}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            background: "white",
            ...style,
          }}
          sandbox="allow-scripts allow-same-origin"
          title={`Slide ${slideId}`}
        />
      );
    }
  );

  // Cache các slide đã render
  const renderedSlides = useMemo(() => {
    return slides.reduce((acc, slide) => {
      acc[slide.id] = (
        <IframeSlideRenderer
          key={slide.id}
          htmlContent={slide.content}
          slideId={slide.id}
        />
      );
      return acc;
    }, {});
  }, [slides]);

  // Tối ưu các hàm xử lý sự kiện với useCallback
  const selectSlide = useCallback(
    (slideId) => {
      setCurrentSlide(slideId);
      setSlides(
        slides.map((slide) => ({
          ...slide,
          isActive: slide.id === slideId,
        }))
      );
    },
    [slides]
  );

  const goToNextSlide = useCallback(() => {
    const currentIndex = slides.findIndex((slide) => slide.id === currentSlide);
    if (currentIndex < slides.length - 1) {
      selectSlide(slides[currentIndex + 1].id);
    }
  }, [currentSlide, slides, selectSlide]);

  const goToPreviousSlide = useCallback(() => {
    const currentIndex = slides.findIndex((slide) => slide.id === currentSlide);
    if (currentIndex > 0) {
      selectSlide(slides[currentIndex - 1].id);
    }
  }, [currentSlide, slides, selectSlide]);

  useEffect(() => {
    const getAllSlide = async () => {
      try {
        const data = await getSlideById(id);
        const slideData = data.data.data;
        console.log(slideData);

        // Sort slides by slideOrder
        const sortedSlides = slideData.sort(
          (a, b) => a.slideOrder - b.slideOrder
        );

        const formattedSlides = sortedSlides.map((slide, index) => ({
          id: slide.id,
          content: slide.htmlContent,
          isActive: index === 0,
          title: slide.title,
          createdAt: slide.createdAt,
          slideOrder: slide.slideOrder,
          role: slide.role,
          isNew: false,
        }));

        setSlides(formattedSlides);
        // Set current slide to first slide's id
        if (formattedSlides.length > 0) {
          setCurrentSlide(formattedSlides[0].id);
        }
        setLectureTitle(slideData[0]?.title || "");
      } catch (error) {
        console.error("Error fetching slides:", error);
      }
    };
    getAllSlide();
  }, [id]);

  const getCurrentSlideContent = () => {
    const current = slides.find((slide) => slide.id === currentSlide);
    return current?.content || "";
  };

  const getProcessedSlideContent = () => {
    const current = slides.find((slide) => slide.id === currentSlide);
    return current?.content || "";
  };

  const updateCurrentSlideContent = (content) => {
    setSlides(
      slides.map((slide) =>
        slide.id === currentSlide ? { ...slide, content } : slide
      )
    );
  };

  const addNewSlide = () => {
    const newSlide = {
      id: Date.now(),
      content: "",
      isActive: false,
      isNew: true,
    };
    setSlides([...slides, newSlide]);
  };

  const handleKeyDown = (e) => {
    if (isPresenting) {
      if (e.key === "ArrowRight" || e.key === " ") {
        goToNextSlide();
      } else if (e.key === "ArrowLeft") {
        goToPreviousSlide();
      } else if (e.key === "Escape") {
        setIsPresenting(false);
      }
    } else {
      if (e.key === "ArrowRight") {
        goToNextSlide();
      } else if (e.key === "ArrowLeft") {
        goToPreviousSlide();
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentSlide, slides.length]);

  const handleSaveHTML = () => {
    updateCurrentSlideContent(tempHTMLContent);
    setShowHTMLModal(false);
  };

  const handleOpenHTMLModal = () => {
    setTempHTMLContent(getCurrentSlideContent());
    setShowHTMLModal(true);
  };

  const duplicateSlide = () => {
    const currentSlideData = slides.find((slide) => slide.id === currentSlide);
    if (currentSlideData) {
      const newSlide = {
        id: Date.now(),
        content: currentSlideData.content,
        isActive: false,
        isNew: false,
      };
      setSlides([...slides, newSlide]);
    }
  };

  const deleteSlide = async () => {
    if (slides.length > 1) {
      try {
        const currentSlideData = slides.find(
          (slide) => slide.id === currentSlide
        );

        // Chỉ gọi API xóa nếu slide không phải là slide mới
        if (currentSlideData && !currentSlideData.isNew) {
          await deleteSlideService(currentSlide);
        }

        // Cập nhật UI
        const filteredSlides = slides.filter(
          (slide) => slide.id !== currentSlide
        );
        setSlides(filteredSlides);
        if (filteredSlides.length > 0) {
          setCurrentSlide(filteredSlides[0].id);
        }
      } catch (error) {
        console.error("Error deleting slide:", error);
        alert("Có lỗi xảy ra khi xóa slide!");
      }
    }
  };

  const resetContent = () => {
    updateCurrentSlideContent("");
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      setIsPresenting(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      setIsPresenting(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isInFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isInFullscreen);
      if (!isInFullscreen) {
        setIsPresenting(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Hàm xử lý lưu slides
  const handleSaveSlides = async () => {
    try {
      setIsSaving(true);

      // Format data để gửi lên server
      const slidesData = slides.map((slide, index) => ({
        id: slide.isNew ? null : slide.id, // Nếu là slide mới thì gửi id là null
        title: slide.title || `Slide ${index + 1}`,
        htmlContent: slide.content,
        slideOrder: index,
        roleId: slide.roleId || 1,
      }));

      // Kiểm tra xem đã có slides trong bài giảng chưa
      const existingSlides = await getSlideById(id);

      if (existingSlides.data.data.length > 0) {
        await updateSlides(slidesData);
      } else {
        await createSlides(id, slidesData);
      }

      // Hiển thị thông báo thành công
      alert("Đã lưu thành công!");
    } catch (error) {
      console.error("Error saving slides:", error);
      alert("Có lỗi xảy ra khi lưu slides!");
    } finally {
      setIsSaving(false);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(slides);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const updatedItems = items.map((item, index) => ({
      ...item,
      slideOrder: index,
    }));

    setSlides(updatedItems);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 shadow-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {mode === "view" ? "Slide Viewer" : "Slide Editor Pro"}
                </span>
                <div className="text-xs text-gray-500 font-medium">
                  {mode === "view"
                    ? "View Mode"
                    : "Professional Presentation Tool"}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={toggleFullscreen}
              className="flex items-center space-x-2 px-5 py-2.5 text-gray-700 bg-white/60 hover:bg-white/80 rounded-lg transition-all duration-200 border border-gray-200/50 shadow-sm hover:shadow-md"
            >
              <Play className="w-4 h-4" />
              <span className="font-medium">Trình chiếu</span>
            </button>
            {mode === "edit" && (
              <button
                onClick={handleSaveSlides}
                disabled={isSaving}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span className="font-medium">
                  {isSaving ? "Đang lưu..." : "Lưu"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 relative overflow-hidden">
        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 overflow-hidden ${
            sidebarOpen && mode === "edit" ? "mr-80" : "mr-0"
          }`}
        >
          {/* Slide Canvas Container */}
          <div className="flex-1 px-32 py-4 min-h-0 overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="flex-1 flex items-center justify-center relative">
                <div className="w-full max-w-4xl ">
                  <div
                    className="relative w-full"
                    style={{
                      paddingBottom: "56.25%",
                    }}
                  >
                    <div
                      className={`absolute inset-0 cursor-pointer group transition-all duration-200 hover:bg-gray-50/50 ${
                        mode === "view" ? "cursor-default" : ""
                      }`}
                      onClick={
                        mode === "edit" ? handleOpenHTMLModal : undefined
                      }
                    >
                      {currentSlide && renderedSlides[currentSlide] ? (
                        <div className="w-full h-full overflow-hidden bg-white rounded-lg shadow-lg relative group">
                          <div className="absolute inset-0 bg-transparent z-10 group-hover:bg-gray-50/20 transition-colors" />
                          <div
                            style={{
                              transform: "scale(0.5, 0.5)",
                              transformOrigin: "top left",
                              width: "200%",
                              height: "200%",
                            }}
                          >
                            {renderedSlides[currentSlide]}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-lg">
                          <div className="text-center opacity-60 group-hover:opacity-80 transition-opacity">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                              <Plus className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-xl font-semibold text-gray-600 mb-2">
                              Tạo slide mới
                            </div>
                            <div className="text-sm text-gray-500">
                              Sửa HTML
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <button
                  onClick={goToPreviousSlide}
                  disabled={
                    slides.findIndex((s) => s.id === currentSlide) === 0
                  }
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goToNextSlide}
                  disabled={
                    slides.findIndex((s) => s.id === currentSlide) ===
                    slides.length - 1
                  }
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Slide Thumbnails */}
          <div
            className={`w-full flex-shrink-0 transition-all duration-300 ${
              thumbnailsVisible
                ? "opacity-100 max-h-40"
                : "opacity-0 max-h-0 overflow-hidden"
            }`}
          >
            <div className="bg-white/60 backdrop-blur-sm border-t border-gray-200/50 shadow-sm">
              <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="thumbnails" direction="horizontal">
                    {(provided) => (
                      <div
                        className="inline-flex items-center space-x-4 px-4 py-4"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {slides.map((slide, index) => (
                          <Draggable
                            key={slide.id}
                            draggableId={slide.id.toString()}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() => selectSlide(slide.id)}
                                className={`relative flex-shrink-0 w-32 h-18 rounded-md border-2 cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-105 select-none ${
                                  slide.id === currentSlide
                                    ? "border-purple-500 shadow-lg shadow-purple-200"
                                    : "border-gray-300 hover:border-gray-400 shadow-sm"
                                } ${
                                  snapshot.isDragging
                                    ? "shadow-xl scale-105"
                                    : ""
                                }`}
                                style={{
                                  ...provided.draggableProps.style,
                                  userSelect: "none",
                                  WebkitUserSelect: "none",
                                  MozUserSelect: "none",
                                  msUserSelect: "none",
                                }}
                              >
                                <div className="w-full h-full bg-white rounded-md overflow-hidden relative pointer-events-none">
                                  {slide.content ? (
                                    <div
                                      className="w-full h-full scale-[0.25] origin-top-left overflow-hidden bg-white"
                                      style={{
                                        width: "400%",
                                        height: "400%",
                                      }}
                                    >
                                      {renderedSlides[slide.id]}
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                      <span className="text-xs font-medium">
                                        Slide {slide.slideOrder || slide.id}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {slide.id === currentSlide && (
                                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg pointer-events-none">
                                    <span className="text-xs text-white font-bold">
                                      {slides.findIndex(
                                        (s) => s.id === slide.id
                                      ) + 1}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {mode === "edit" && (
                          <button
                            onClick={addNewSlide}
                            className="flex-shrink-0 w-32 h-18 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group"
                          >
                            <Plus className="w-6 h-6 text-gray-400 group-hover:text-purple-500 transition-colors" />
                          </button>
                        )}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Component */}
        {mode === "edit" && (
          <RightSidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            lectureTitle={lectureTitle}
            setLectureTitle={setLectureTitle}
            duplicateSlide={duplicateSlide}
            deleteSlide={deleteSlide}
            resetContent={resetContent}
            currentSlide={currentSlide}
            slides={slides}
            getCurrentSlideContent={getCurrentSlideContent}
            thumbnailsVisible={thumbnailsVisible}
          />
        )}
      </div>

      {/* Presentation Modal */}
      {isPresenting && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center">
            {getProcessedSlideContent() ? (
              <IframeSlideRenderer
                htmlContent={getProcessedSlideContent()}
                slideId={currentSlide}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            ) : (
              <div className="text-white text-2xl">Empty Slide</div>
            )}
          </div>

          {/* Click Areas for Navigation */}
          <div className="absolute inset-0 flex">
            <div
              className="w-1/2 h-full cursor-pointer"
              onClick={goToPreviousSlide}
            />
            <div
              className="w-1/2 h-full cursor-pointer"
              onClick={goToNextSlide}
            />
          </div>
        </div>
      )}

      {/* HTML Modal */}
      {showHTMLModal && mode === "edit" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Chỉnh sửa HTML - Slide{" "}
                  {slides.findIndex((s) => s.id === currentSlide) + 1}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Tạo nội dung slide với HTML tùy chỉnh (CSS sẽ được tự động
                  tách biệt)
                </p>
              </div>
              <button
                onClick={() => setShowHTMLModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Preview */}
              <div className="w-1/2 py-6 bg-white border-r border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Preview (Tỉ lệ 16:9) - CSS Isolated
                </h3>
                <div className="relative w-full bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-inner">
                  <div
                    className="relative w-full bg-white"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <div className="absolute inset-0 overflow-hidden">
                      <div
                        className="w-full h-full bg-white"
                        style={{
                          transform: "scale(0.5, 0.5)",
                          transformOrigin: "top left",
                          width: "200%",
                          height: "250%",
                        }}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              tempHTMLContent ||
                              '<div style="padding: 20px; text-align: center; color: #666; font-family: Arial;">Nhập HTML code để xem preview</div>',
                          }}
                          className="w-full h-full"
                          style={{
                            minHeight: "100vh",
                            overflow: "hidden",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* HTML Editor */}
              <div className="w-1/2 p-6 bg-gray-50/50 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">
                    HTML Code
                  </h3>
                  <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                    {tempHTMLContent.length} ký tự
                  </div>
                </div>
                <textarea
                  value={tempHTMLContent}
                  onChange={(e) => setTempHTMLContent(e.target.value)}
                  className="flex-1 resize-none border border-gray-300 rounded-xl p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
                  placeholder="Nhập HTML code của bạn tại đây...&#10;&#10;Lưu ý: CSS sẽ tự động được tách biệt giữa các slide để tránh xung đột!"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50/50">
              <button
                onClick={() => setShowHTMLModal(false)}
                className="px-6 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveHTML}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl"
              >
                Lưu slide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideManage;
