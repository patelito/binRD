import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditProfile } from './editProfile';

@NgModule({
  declarations: [
    EditProfile,
  ],
  imports: [
    IonicPageModule.forChild(EditProfile),
  ],
})
export class ProfilePageModule {}
