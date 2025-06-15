import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
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

// Memoized IframeSlideRenderer to prevent unnecessary re-renders
const IframeSlideRenderer = React.memo(
  ({ htmlContent, slideId, style = {} }) => {
    const iframeRef = useRef(null);

    useEffect(() => {
      if (iframeRef.current && htmlContent) {
        const iframe = iframeRef.current;

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
  },
  // Custom comparison function to prevent re-renders when content hasn't changed
  (prevProps, nextProps) => {
    return (
      prevProps.htmlContent === nextProps.htmlContent &&
      prevProps.slideId === nextProps.slideId &&
      JSON.stringify(prevProps.style) === JSON.stringify(nextProps.style)
    );
  }
);

const SlideManage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "edit";
  const navigate = useNavigate();

  // Separate states to minimize re-renders
  const [slides, setSlides] = useState([]);
  const [currentSlideId, setCurrentSlideId] = useState(null);
  const [lectureTitle, setLectureTitle] = useState("");
  const [showHTMLModal, setShowHTMLModal] = useState(false);
  const [tempHTMLContent, setTempHTMLContent] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [thumbnailsVisible, setThumbnailsVisible] = useState(true);
  const [isPresenting, setIsPresenting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Use refs to store values that don't need to trigger re-renders
  const slidesRef = useRef(slides);
  const currentSlideIdRef = useRef(currentSlideId);

  // Update refs when state changes
  useEffect(() => {
    slidesRef.current = slides;
  }, [slides]);

  useEffect(() => {
    currentSlideIdRef.current = currentSlideId;
  }, [currentSlideId]);

  // Memoize current slide data
  const currentSlide = useMemo(() => {
    return slides.find((slide) => slide.id === currentSlideId);
  }, [slides, currentSlideId]);

  // Memoize current slide index
  const currentSlideIndex = useMemo(() => {
    return slides.findIndex((slide) => slide.id === currentSlideId);
  }, [slides, currentSlideId]);

  // Optimized slide selection
  const selectSlide = useCallback(
    (slideId) => {
      if (slideId === currentSlideIdRef.current) return; 

      setCurrentSlideId(slideId);

      const selectedSlide = slidesRef.current.find(
        (slide) => slide.id === slideId
      );
      if (selectedSlide?.title && selectedSlide.title !== lectureTitle) {
        setLectureTitle(selectedSlide.title);
      }
    },
    [lectureTitle]
  );

  const goToNextSlide = useCallback(() => {
    const currentIndex = slidesRef.current.findIndex(
      (slide) => slide.id === currentSlideIdRef.current
    );
    if (currentIndex < slidesRef.current.length - 1) {
      selectSlide(slidesRef.current[currentIndex + 1].id);
    }
  }, [selectSlide]);

  const goToPreviousSlide = useCallback(() => {
    const currentIndex = slidesRef.current.findIndex(
      (slide) => slide.id === currentSlideIdRef.current
    );
    if (currentIndex > 0) {
      selectSlide(slidesRef.current[currentIndex - 1].id);
    }
  }, [selectSlide]);

  // Load slides only once
  useEffect(() => {
    const getAllSlides = async () => {
      try {
        const data = await getSlideById(id);
        let slideData = data.data.data;

        // Nếu là view, chỉ lấy slide role 2 hoặc 3
        if (mode === "view") {
          slideData = slideData.filter(
            (slide) =>
              slide.roleId === 2 ||
              slide.roleId === 3 ||
              (slide.role && (slide.role.id === 2 || slide.role.id === 3))
          );
        }

        const sortedSlides = slideData.sort(
          (a, b) => a.slideOrder - b.slideOrder
        );
        const formattedSlides = sortedSlides.map((slide, index) => ({
          id: slide.id,
          content: slide.htmlContent,
          title: slide.title,
          createdAt: slide.createdAt,
          slideOrder: slide.slideOrder,
          role: slide.role,
          isNew: false,
        }));

        setSlides(formattedSlides);
        if (formattedSlides.length > 0) {
          setCurrentSlideId(formattedSlides[0].id);
          setLectureTitle(formattedSlides[0].title || "");
        }
      } catch (error) {
        console.error("Error fetching slides:", error);
      }
    };
    getAllSlides();
  }, [id, mode]);

  // Optimized content getters
  const getCurrentSlideContent = useCallback(() => {
    return currentSlide?.content || "";
  }, [currentSlide]);

  const getProcessedSlideContent = useCallback(() => {
    return currentSlide?.content || "";
  }, [currentSlide]);

  // Optimized content update - only update the specific slide
  const updateCurrentSlideContent = useCallback((content) => {
    setSlides((prevSlides) =>
      prevSlides.map((slide) =>
        slide.id === currentSlideIdRef.current ? { ...slide, content } : slide
      )
    );
  }, []);

  const addNewSlide = useCallback(() => {
    const newSlide = {
      id: Date.now(),
      content: "",
      isNew: true,
      title: "",
      slideOrder: slides.length,
    };
    setSlides((prevSlides) => [...prevSlides, newSlide]);
  }, [slides.length]);

  // Optimized keyboard handler
  const handleKeyDown = useCallback(
    (e) => {
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
    },
    [isPresenting, goToNextSlide, goToPreviousSlide]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleSaveHTML = useCallback(() => {
    updateCurrentSlideContent(tempHTMLContent);
    setShowHTMLModal(false);
  }, [tempHTMLContent, updateCurrentSlideContent]);

  const handleOpenHTMLModal = useCallback(() => {
    setTempHTMLContent(getCurrentSlideContent());
    setShowHTMLModal(true);
  }, [getCurrentSlideContent]);

  const duplicateSlide = useCallback(() => {
    if (currentSlide) {
      const newSlide = {
        id: Date.now(),
        content: currentSlide.content,
        title: currentSlide.title + " (Copy)",
        isNew: true,
        slideOrder: slides.length,
      };
      setSlides((prevSlides) => [...prevSlides, newSlide]);
    }
  }, [currentSlide, slides.length]);

  const deleteSlide = useCallback(async () => {
    if (slides.length <= 1) return;

    try {
      if (currentSlide && !currentSlide.isNew) {
        await deleteSlideService(currentSlideId);
      }

      const filteredSlides = slides.filter(
        (slide) => slide.id !== currentSlideId
      );
      setSlides(filteredSlides);

      if (filteredSlides.length > 0) {
        const newCurrentIndex = Math.min(
          currentSlideIndex,
          filteredSlides.length - 1
        );
        setCurrentSlideId(filteredSlides[newCurrentIndex].id);
      }
    } catch (error) {
      console.error("Error deleting slide:", error);
      alert("Có lỗi xảy ra khi xóa slide!");
    }
  }, [slides, currentSlide, currentSlideId, currentSlideIndex]);

  const resetContent = useCallback(() => {
    updateCurrentSlideContent("");
  }, [updateCurrentSlideContent]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      setIsPresenting(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      setIsPresenting(false);
    }
  }, []);

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

  const updateSlideTitle = useCallback(
    (newTitle) => {
      setSlides((prevSlides) =>
        prevSlides.map((slide) =>
          slide.id === currentSlideId ? { ...slide, title: newTitle } : slide
        )
      );
    },
    [currentSlideId]
  );

  const updateSlideRole = useCallback(
    (isTeacher, isStudent) => {
      setSlides((prevSlides) =>
        prevSlides.map((slide) => {
          if (slide.id === currentSlideId) {
            let roleId;
            if (isTeacher && isStudent) {
              roleId = 3;
            } else if (isTeacher) {
              roleId = 1;
            } else if (isStudent) {
              roleId = 2;
            } else {
              roleId = null;
            }
            return { ...slide, roleId };
          }
          return slide;
        })
      );
    },
    [currentSlideId]
  );

  const handleSaveSlides = useCallback(async () => {
    try {
      setIsSaving(true);

      const existingSlides = slides.filter((slide) => !slide.isNew);
      const newSlides = slides.filter((slide) => slide.isNew);

      const updateData = existingSlides.map((slide, index) => ({
        id: slide.id,
        title: slide.title || `Slide ${index + 1}`,
        htmlContent: slide.content,
        slideOrder: index,
        roleId: slide.roleId || slide.role?.id || 1,
      }));

      const createData = newSlides.map((slide, index) => ({
        title: slide.title || `Slide ${index + 1}`,
        htmlContent: slide.content,
        slideOrder: existingSlides.length + index,
        roleId: slide.roleId || slide.role?.id || 1,
      }));

      const existingSlidesResponse = await getSlideById(id);

      if (existingSlidesResponse.data.data.length > 0) {
        if (updateData.length > 0) {
          await updateSlides(updateData);
        }
        if (createData.length > 0) {
          await createSlides(id, createData);
        }
      } else {
        await createSlides(id, [...updateData, ...createData]);
      }

      // Refresh slides after save
      const updatedSlidesResponse = await getSlideById(id);
      const updatedSlides = updatedSlidesResponse.data.data
        .sort((a, b) => a.slideOrder - b.slideOrder)
        .map((slide) => ({
          id: slide.id,
          content: slide.htmlContent,
          title: slide.title,
          createdAt: slide.createdAt,
          slideOrder: slide.slideOrder,
          role: slide.role,
          isNew: false,
        }));

      setSlides(updatedSlides);
      if (updatedSlides.length > 0 && !currentSlideId) {
        setCurrentSlideId(updatedSlides[0].id);
      }

      console.log("Đã lưu thành công!");
    } catch (error) {
      console.error("Error saving slides:", error);
      alert("Có lỗi xảy ra khi lưu slides!");
    } finally {
      setIsSaving(false);
    }
  }, [slides, id, currentSlideId]);

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;

    setSlides((prevSlides) => {
      const items = Array.from(prevSlides);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      return items.map((item, index) => ({
        ...item,
        slideOrder: index,
      }));
    });
  }, []);

  // Memoize rendered slides to prevent unnecessary re-renders
  const renderedSlides = useMemo(() => {
    const rendered = {};
    slides.forEach((slide) => {
      rendered[slide.id] = (
        <IframeSlideRenderer
          key={slide.id}
          htmlContent={slide.content}
          slideId={slide.id}
        />
      );
    });
    return rendered;
  }, [slides]);

  // Memoize thumbnail components with better scaling
  const thumbnailComponents = useMemo(() => {
    return slides.map((slide, index) => (
      <Draggable key={slide.id} draggableId={slide.id.toString()} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => selectSlide(slide.id)}
            className={`relative flex-shrink-0 w-42 h-24 rounded-lg border-2 cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-105 select-none ${
              slide.id === currentSlideId
                ? "border-purple-500 shadow-lg shadow-purple-200"
                : "border-gray-300 hover:border-gray-400 shadow-sm"
            } ${snapshot.isDragging ? "shadow-xl scale-105" : ""}`}
            style={{
              ...provided.draggableProps.style,
              userSelect: "none",
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
              ...(snapshot.isDragging && {
                zIndex: 9999,
              }),
            }}
          >
            <div
              className={`w-full h-full bg-white rounded-lg overflow-hidden relative ${
                snapshot.isDragging ? "" : "pointer-events-none"
              }`}
            >
              {slide.content ? (
                <div
                  className="w-[90%] h-full overflow-hidden bg-white"
                  style={{
                    transform: "scale(0.15, 0.15)",
                    transformOrigin: "top left",
                    width: "667%",
                    height: "100vh",
                  }}
                >
                  <IframeSlideRenderer
                    htmlContent={slide.content}
                    slideId={slide.id}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <span className="text-xs font-medium">Slide {index + 1}</span>
                </div>
              )}
            </div>
            {slide.id === currentSlideId && (
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg pointer-events-none">
                <span className="text-xs text-white font-bold">
                  {index + 1}
                </span>
              </div>
            )}
          </div>
        )}
      </Draggable>
    ));
  }, [slides, currentSlideId, selectSlide]);

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
                      {currentSlideId && renderedSlides[currentSlideId] ? (
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
                            {renderedSlides[currentSlideId]}
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
                  disabled={currentSlideIndex === 0}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goToNextSlide}
                  disabled={currentSlideIndex === slides.length - 1}
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
                ? "opacity-100 max-h-48"
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
                        {thumbnailComponents}
                        {provided.placeholder}
                        {mode === "edit" && (
                          <button
                            onClick={addNewSlide}
                            className="flex-shrink-0 w-40 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 group"
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
            setLectureTitle={(newTitle) => {
              setLectureTitle(newTitle);
              updateSlideTitle(newTitle);
            }}
            duplicateSlide={duplicateSlide}
            deleteSlide={deleteSlide}
            resetContent={resetContent}
            currentSlide={currentSlideId}
            slides={slides}
            updateSlideRole={updateSlideRole}
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
                slideId={currentSlideId}
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
