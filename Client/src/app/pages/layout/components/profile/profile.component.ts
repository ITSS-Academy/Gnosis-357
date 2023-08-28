import { Component,ChangeDetectionStrategy, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Course } from 'src/app/models/Course.model';
import { Profile } from 'src/app/models/Profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  @Input('isEdit') isEdit: boolean = false;
  @Input('course') course: Course | null = null;
  @Input('profile') profile: Profile | null = null;

  courseForm: FormGroup = new FormGroup({
    _id: new FormControl({ value: '', disabled: true }, Validators.required),
    name: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl(null, Validators.required),
    imageUrl: new FormControl('', Validators.required),
  });

  

  ngOnInit(): void {
    console.log(this.course);
    if (this.isEdit) {
      if (this.course != null) {
        this.courseForm = new FormGroup({
          _id: new FormControl(
            { value: this.course._id, disabled: true },
            Validators.required
          ),
          name: new FormControl(this.course.name, Validators.required),
          category: new FormControl(this.course.category, Validators.required),
          description: new FormControl(
            this.course.description,
            Validators.required
          ),
          price: new FormControl(this.course.price, Validators.required),
          imageUrl: new FormControl(this.course.imageUrl, Validators.required),
        });
      }
    }
  }
}
