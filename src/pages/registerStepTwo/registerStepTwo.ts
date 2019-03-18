import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


import { DatabaseProvider } from '../../providers/database/database';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registerStepTwo',
  templateUrl: 'registerStepTwo.html',
})
export class RegisterStepTwo {

  selectedMedia = 'http://farrellaudiovideo.com/wp-content/uploads/2016/02/default-profile-pic-300x300.png';
  user:string;
  mail:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private dbProvider: DatabaseProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  register() {
    if(this.user == null)
    {
      alert("Completar los campos");
    }
    else
    {
      this.dbProvider.getUser(this.mail, this.user).then(d => {
        console.log(d);
        if (d.rows.length <= 0)
        {
          this.dbProvider.createUser(this.navParams.data.nombre, this.user, this.selectedMedia, this.navParams.data.telefono, this.navParams.data.password
          , this.mail).then(d => {
            alert('Se ha registrado correctamente!')
          });
          this.navCtrl.popToRoot();
        }
        else {
          alert("Ese usuario o email ya esta registrado")
        }
      });
    }
  }

  getPicture() {
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    this.camera.getPicture( options )
    .then(imageData => {
      this.selectedMedia = `data:image/jpeg;base64,${imageData}`;
    })
    .catch(error =>{
      console.error( error );
    });
  }

  goBack() {
    this.navCtrl.pop();
  }


}
