import { HttpException, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './entities/course.entity';
import { Model, SaveOptions } from 'mongoose';
import { Profile } from 'src/profile/entities/profile.entity';



@Injectable()
export class CourseService {

  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>

  ) { }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      console.log(createCourseDto);
      const createdCat = new this.courseModel(createCourseDto);
      return createdCat.save();
    }
    catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }


  async findAll(): Promise<Course[]> {
    try {
      return await this.courseModel.find().exec();
    }
    catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findOne(id: string): Promise<Course> {
    try {
      return await this.courseModel.findById(id).exec();
    }
    catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    try {
      const updateCourse = await this.courseModel.findOneAndUpdate({ _id: id },
        { ...updateCourseDto }, { new: true });
      return updateCourse;

    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: string): Promise<Course> {
    try {
      const deleteCourse = await this.courseModel.findOneAndDelete({ _id: id });
      return deleteCourse;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async buyCourse(courseId: string, userId: string): Promise<Profile> {
    const filter = { id: userId };
    const update = { $addToSet: { courses: courseId } };
    const options = { new: true, upsert: false };

    const profile = await this.profileModel.findOneAndUpdate(
      filter,
      update,
      options,
    );

    const courseFilter = { _id: courseId };
    const courseUpdate = { $addToSet: { students: userId } };
    const courseOptions = { new: true, upsert: false };

    const course = await this.courseModel.findOneAndUpdate(
      courseFilter,
      courseUpdate,
      courseOptions,
    );


    return profile;
  }



}