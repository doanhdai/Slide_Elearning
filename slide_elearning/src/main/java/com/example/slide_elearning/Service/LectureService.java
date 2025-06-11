package com.example.slide_elearning.Service;

import com.example.slide_elearning.Entity.lecture;
import com.example.slide_elearning.Entity.lecture.LectureStatus;
import com.example.slide_elearning.Entity.user;
import com.example.slide_elearning.repository.LectureRepository;
import com.example.slide_elearning.repository.UserRepository;
import com.example.slide_elearning.dto.LectureResponseDto;
import com.example.slide_elearning.dto.UserDto;
// import com.example.slide_elearning.dto.SlidesDto;
import com.example.slide_elearning.dto.LectureCreateRequestDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LectureService {
    @Autowired
    private LectureRepository lectureRepository;

    @Autowired
    private UserRepository userRepository;

    public List<LectureResponseDto> getAllLectures() {
        List<lecture> lectures = lectureRepository.findAllLecturesWithUser();
        return lectures.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    private LectureResponseDto convertToDto(lecture lecture) {
        UserDto userDto = null;
        if (lecture.getUser() != null) {
            userDto = new UserDto(lecture.getUser().getId(), lecture.getUser().getFullName(),
                    lecture.getUser().getEmail());
        }



        return new LectureResponseDto(
                lecture.getId(),
                lecture.getCreatedAt(),
                userDto,
                lecture.getLectureName(),
                lecture.getSubject(),
                lecture.getChapter(),
                lecture.getLectureLink(),
                lecture.getLinkGenspack(),
                lecture.getStatus(),
                lecture.getDescription(),
                lecture.getStudyClass()
          );
    }

    @Transactional
    public lecture createLecture(LectureCreateRequestDto requestDto) {
        user user = userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + requestDto.getUserId()));

        lecture newLecture = new lecture();
        newLecture.setLectureName(requestDto.getLectureName());
        newLecture.setSubject(requestDto.getSubject());
        newLecture.setChapter(requestDto.getChapter());
        newLecture.setLectureLink(requestDto.getLectureLink());
        newLecture.setLinkGenspack(requestDto.getLinkGenspack());
        newLecture.setDescription(requestDto.getDescription());
        newLecture.setStudyClass(requestDto.getStudyClass());
        newLecture.setUser(user);
        newLecture.setCreatedAt(LocalDateTime.now());
        newLecture.setStatus(LectureStatus.New);

        return lectureRepository.save(newLecture);
    }

    @Transactional
    public lecture updateStatus(Integer id, LectureStatus status) {
        lecture lecture = lectureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lecture not found"));

        lecture.setStatus(status);
        return lectureRepository.save(lecture);
    }

    @Transactional
    public lecture updateDescription(Integer id, String description) {
        lecture lecture = lectureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lecture not found"));

        if (lecture.getStatus() != LectureStatus.New) {
            throw new RuntimeException("Can only update description when status is New");
        }

        lecture.setDescription(description);
        return lectureRepository.save(lecture);
    }

    @Transactional
    public void deleteLecture(Integer id) {
        if (!lectureRepository.existsById(id)) {
            throw new RuntimeException("Lecture not found");
        }
        lectureRepository.deleteById(id);
    }
}