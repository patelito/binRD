import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterStepTwo} from './registerStepTwo';

@NgModule({
  declarations: [
    RegisterStepTwo,
  ],
  imports: [
    IonicPageModule.forChild(RegisterStepTwo),
  ],
})
export class RegisterStepTwoModule {}
