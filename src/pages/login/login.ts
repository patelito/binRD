import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { TabsPage } from '../tabs/tabs';

import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

    username:string;
    password:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private dbProvider: DatabaseProvider) {
  }

  login() {
      if(this.username != null && this.password != null)
      {
        this.dbProvider.validateUser(this.username, this.password).then(d => {
          console.log(d);
          if (d == true)
          {
            this.navCtrl.push(TabsPage, {
              username: this.username
            })
          }
          else {
            alert(d);
          }
        });
      }
      else
      {
        alert("Completar los campos");
      }
  }

  goRegister() {
      this.navCtrl.push(RegisterPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}


/**
 * 
 * 
 * this.dbProvider.getUser(this.mail, this.user).then(d => {
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
 */
