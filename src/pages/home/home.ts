import { Component } from '@angular/core';
import { NavController, Platform, NavParams } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { Description } from '../description/description';
import { DatabaseProvider } from '../../providers/database/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  posts: Object[];
  bookmarks: Number[];
  selectedPost: Number;

  constructor(public navCtrl: NavController, private databaseprovider: DatabaseProvider, private navParams: NavParams, public callNumber: CallNumber) {
    
    
  }

  ionViewDidEnter() {
    this.databaseprovider.getDatabaseState().subscribe( rdy => {
      if( rdy ) {
        // return postSearch ? postSearch :this.loadData()
        return this.loadData()
      }
    })
  }

  loadData() {
    let func = this.databaseprovider.getAllPost();
    if(this.navParams.data.catId) {
      console.log('has thing', this.navParams.data.catId);
      func = this.databaseprovider.getPostsByCategory(this.navParams.data.catId);
    }
    
    func.then( data=> {
      console.log("DATA: ", data);
      this.posts = [...data];
    })
  }

  // getPostsBookmarkers() {
  //   const idUser = ACTUAL_USER;
  //   this.databaseprovider.getBookmarks( idUser ).then( data => {
  //     this.bookmarks = [...data];
  //   })
  // }

  goToDescription( postId ) {
    console.log("POST SELECTED: ", postId)
    this.navCtrl.push(Description, { postId });
  }

  contactSeller(phone) {
    this.callNumber.callNumber(`${phone}`, true);
  }
}
