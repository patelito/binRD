import { HomePage } from './../home/home';
import { Component, NgModule, NgZone, ViewChild } from '@angular/core';
import { Content, Events, IonicPage, NavController, NavParams, App, ModalController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { DatabaseProvider } from '../../providers/database/database';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CallNumber } from '@ionic-native/call-number';
import { EditProfile } from '../editProfile/editProfile';
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
  @ViewChild(Content) content: Content

  id: number;
  name: string = "";
  userName: string = "";
  avatar: string = "";
  phone: string = "";
  password: string;
  email: string = "";
  posts: any[];


  constructor( 
    public alertCtrl: AlertController, 
    public events: Events, 
    private zone: NgZone, 
    public app: App, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public storage: Storage, 
    public databaseProvider: DatabaseProvider, 
    private camera: Camera, 
    public callNumber: CallNumber, 
    public modalCtrl: ModalController
  ) {

  }


  ionViewWillEnter() {
    this.databaseProvider.getDatabaseState().subscribe( rdy => {
      if( rdy ) {
        this.storage.get('userid').then(uid => {
          this.loadData(uid)
          this.id = uid;
        });
        
      }
    })
  }

  loadData(uid) {
    this.getUserInfoById(uid);
    this.getUserPosts(uid);
  }

  getUserPosts(userId: number ) {
    this.databaseProvider.getPostsByUserId(userId).then(data => {
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
      this.databaseProvider.editProfilePicture(this.id, this.avatar);
    })
    .catch(error =>{
      console.error( error );
    });
  }

  showConfirmationDelete( postId ) {
    const prompt = this.alertCtrl.create({
      title: 'Aviso',
      message: 'Estas a punto de borrar este post, una vez borrado no estara disponible a la vista. Seguro que deseas borrar?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {},
        },
        {
          text: 'Si, borrar post',
          handler: () => {
            this.deletePost(postId);
          }
        }
      ]
    })
    prompt.present();
  }
  deletePost( postId ) {
    this.databaseProvider.deletePost( postId ).then( () => {
      this.loadData(this.id)
    })
  }

  logout() {
        console.log('logout');
        this.app.getRootNav().popToRoot();
  }

  goToEditProfile() {
    this.navCtrl.push(EditProfile);
  }

  goToDescription(postId) {
    this.navCtrl.push(Description, { postId });
  }

  contactSeller(phone) {
    this.callNumber.callNumber(`${phone}`, true);
  }
}
