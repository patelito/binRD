import { HomePage } from '../home/home';
import { Component, NgModule, NgZone } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, App, ModalController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { DatabaseProvider } from '../../providers/database/database';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CallNumber } from '@ionic-native/call-number';



/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editProfile',
  templateUrl: 'editProfile.html',
})
export class EditProfile {
  id: number;
  name: string;
  mail: string;
  phone: string;
  usuario: string;
  avatar: string;
  password:string;
  newName: string;
  newMail: string;
  newPhone: string;
  uid: number;

  constructor(public events: Events, private zone: NgZone, public app: App, public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public databaseProvider: DatabaseProvider, private camera: Camera, public callNumber: CallNumber, public modalCtrl: ModalController) {
  
  }

  ionViewWillEnter() {
    this.databaseProvider.getDatabaseState().subscribe( rdy => {
      if( rdy ) {
        this.storage.get('userid').then(uid => {
          this.uid = uid;
          return this.loadData(uid)
        });
        
      }
    })
  }

  loadData(uid) {
    this.databaseProvider.getUserByUserId(uid).then( dt => {
      if(dt){
        this.name = dt.name;
        this.mail = dt.email;
        this.phone = dt.phone;
        this.usuario = dt.username;
        this.avatar = dt.avatar;
        this.password = dt.password;
      }
      
    })
  }

  // TODO refetch profile page with the data updated
  updateInfo() {
    const name = this.newName ? this.newName : this.name;
    const mail = this.newMail ? this.newMail : this.mail;
    const phone = this.newPhone ? this.newPhone : this.phone;
    const uid = this.uid; 
    console.log("uid: ", uid);
    return this.databaseProvider.editUser(uid, name, phone, mail ).then(dt => {
      if (dt) {
        console.log(dt);
        return alert('Datos editados correctamente!')
      }

    })
  }
  
}

