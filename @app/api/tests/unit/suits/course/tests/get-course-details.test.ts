import { GetCourseDetailsQuery } from '../../../../../src/course/application/queries/courseDetails/get.courseDetails.query';
import { CourseRepositoryMock } from './utils/course.repository.mock';
import { ImageRepositoryMock } from '../../image/tests/utils/image.repository.mock';
import { courseDetailsDto } from '../../../../../src/course/application/queries/courseDetails/types/dto';


const courseId = '987564321'
const courseData = {
    courseId: courseId,
} satisfies courseDetailsDto

const courseRepo = new CourseRepositoryMock()
const imageRepo = new ImageRepositoryMock()
const getCourseDetailsQuery = new GetCourseDetailsQuery(courseRepo,imageRepo)
const resultCourse = getCourseDetailsQuery.execute(courseData)

lookFor(resultCourse.unwrap()).toDeepEqual({
    title: 'course title'
    description: 'course description'
    calories: 100
    category: 'Yoga'
    image: 'http://res.cloudinary.com/dxl3nxp3r/image/upload/v1716670472/ujmarev4bv2rl58rsrdm.png'
    
})