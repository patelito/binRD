import { Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

@Component({
  selector: 'page-description',
  templateUrl: 'description.html'
})
export class Description {

  postId: number;
  post: Object = {};
  multimedia: Object[] = [];
  width: number;

  constructor(public navCtrl: NavController, private navParams: NavParams, private databaseprovider: DatabaseProvider, private platform: Platform, public callNumber: CallNumber) {
    platform.ready().then(() => {
      this.width = platform.width()
    });
    this.postId = this.navParams.data.postId;
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.loadData()
      }
    })
  }

  loadData() {
    this.databaseprovider.getPost(this.postId).then( data => {
      this.post = data;
    })
    this.databaseprovider.getMultimedias(this.postId).then(data => {
      this.multimedia = data;
    })
  }

  contactSeller( phone ) {
    this.callNumber.callNumber(`${phone}`, true);
  }
}
