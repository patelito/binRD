import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  nombre:string;
  apellido:string;
  mail:string;
  telefono:string;
  password:string;
  repassword:string;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  register() {
    if(this.nombre == null || this.apellido == null || this.telefono == null || this.mail == null || this.password == null || this.repassword == null)
    {
      alert("Completar los campos");
    }
    else
    {
      if(this.password != this.repassword)
      {
        alert("Contraseñas no son iguales");
      }
      else
      {
        
        this.navCtrl.pop();

      }
    }
  }

  goLogin() {
    this.navCtrl.pop();
  }
}
