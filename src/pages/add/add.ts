import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { IfObservable } from 'rxjs/observable/IfObservable';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { Description } from '../description/description';

@IonicPage()
@Component({
  selector: 'page-add',
  templateUrl: 'add.html',
})
export class AddPage {
  categories = [];
  
  selectedMedia = [];
  selectedCategory: number;
  title: string;
  price: number;
  description: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private dbProvider: DatabaseProvider) {
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if(ready) {
        this.dbProvider.getCategories().then(data => {
          this.categories = data;
        });
      }
    });
    
    // this.selectedMedia = [
    //   { thumbnail: 'https://st.motortrend.com/uploads/sites/5/2016/10/2016-Tesla-Model-S-60-front-three-quarter-in-motion-02-e1477952073682.jpg'},
    //   { thumbnail: 'https://www.tesla.com/content/dam/tesla-site/sx-redesign/img/models/footer/models@2.jpg'},
    //   { thumbnail: 'https://www.carzone.ie/reviews/images/591_ev4.JPG'},
    //   { thumbnail: 'https://www.carzone.ie/reviews/images/591_ev4.JPG'},
    //   { thumbnail: 'https://www.carzone.ie/reviews/images/591_ev4.JPG'}
    // ]
  }

  getPicture() {
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    this.camera.getPicture( options )
    .then(imageData => {
      this.selectedMedia.push(`data:image/jpeg;base64,${imageData}`);
    })
    .catch(error =>{
      console.error( error );
    });
  }

  removePicture(media) {
    this.selectedMedia.splice( this.selectedMedia.indexOf(media), 1 );
  }

  publish() {
    if(!this.title) {
      return alert('Debe llenar el campo de titulo!');
    }
    if(!this.price || this.price <= 0) {
      return alert('Debe especificar un precio!')
    }
    if(!this.description) {
      return alert('Debe llenar la desripción!');
    }
    if(!this.selectedCategory) {
      return alert('Debe elegir una categoría!');
    }
    if(this.selectedMedia.length <= 0) {
      return alert('Debe subir al menos una foto!')
    }

    this.dbProvider.addPost(this.title, this.description, 
      this.price, this.selectedCategory, this.selectedMedia).then(d => {
        alert('Publicación realizada exitosamente!')
        this.title = '';
        this.price = 0;
        this.description = '';
        this.selectedCategory = 0;
        this.selectedMedia = [];
        this.navCtrl.push(Description, { postId: d.insertId });
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPage');
  }

}
