import { HomePage } from './../home/home';
import { Component, NgModule } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { DatabaseProvider } from '../../providers/database/database';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CallNumber } from '@ionic-native/call-number';
import { Description } from '../description/description';



/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  id: number;
  name: string;
  userName: string;
  avatar: string;
  phone: string;
  password: string;
  email: string;
  posts: any[];


  constructor(public app: App, public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public databaseProvider: DatabaseProvider, private camera: Camera, public callNumber: CallNumber) {
    this.storage.get('userid').then(val => {
      console.log(val);
      this.databaseProvider.getDatabaseState().subscribe(ready => {
        if(ready){
          this.getUserInfoById(val);
        }
      });
      
    })
  }

  ionViewDidEnter() {
    this.databaseProvider.getDatabaseState().subscribe( rdy => {
      if( rdy ) {
        this.storage.get('userid').then(uid => {
          return this.loadData(uid)
        });
        
      }
    })
  }

  loadData(uid) {
    
    this.databaseProvider.getPostsByUserId(uid).then( data=> {
      console.log("DATA USER: ", data);
        this.posts = data;
    }).catch(err => {
      console.log("Deez Nuts", err)
      return err;
    })
  }

  getUserInfoById(userId: number){
    this.databaseProvider.getUserByUserId(userId).then(data => {
      this.id = data.id;
      this.name = data.name;
      this.userName = data.username;
      this.avatar = data.avatar;
      this.phone = data.phone;
      this.password = data.password;
      this.email = data.email;

    }).catch(err => {
      console.log("It does not work", err);
      return err;
    })
  }

  getPicture() {
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    this.camera.getPicture( options )
    .then(imageData => {
      this.avatar = `data:image/jpeg;base64,${imageData}`;
      this.databaseProvider.editUser(this.id, this.name, this.userName, this.avatar, this.phone, this.password, this.email).then(data => {
        console.log("Dique guarda", data);
      });
    })
    .catch(error =>{
      console.error( error );
    });
  }

  logout() {
        console.log('logout');
        this.app.getRootNav().popToRoot();
  }
  goToDescription(postId) {
    this.navCtrl.push(Description, { postId });
  }

  contactSeller(phone) {
    this.callNumber.callNumber(`${phone}`, true);
  }
}
