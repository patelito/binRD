import { Component } from '@angular/core';
import { NavController, Platform, NavParams } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { Description } from '../description/description';
import { DatabaseProvider } from '../../providers/database/database';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  posts: any[];
  bookmarks = [];
  bookmarked : Boolean[];
  selectedPost: Number;
  currentUserId: Number;
  pageTitle: String;
  onlyBooked = false;

  constructor(public navCtrl: NavController, private databaseprovider: DatabaseProvider, private storage: Storage, private navParams: NavParams, public callNumber: CallNumber) {
    if(this.navParams.data.pageTitle) {
      this.pageTitle = this.navParams.data.pageTitle;
    }

    if(this.navParams.data.onlyBookmarks) {
      this.onlyBooked = true;
    }
  }

  ionViewDidEnter() {
    this.databaseprovider.getDatabaseState().subscribe( rdy => {
      if( rdy ) {
        this.storage.get('userid').then(uid => {
          return this.loadData(uid)
        });
        
      }
    })
  }

  loadData(uid) {

    let func;
    if(this.navParams.data.catId) {
      func = this.databaseprovider.getPostsByCategory(this.navParams.data.catId);
    } else if(this.navParams.data.search) {
      func = this.databaseprovider.getPostsByName(this.navParams.data.search);
    } else if (this.onlyBooked) {
      func = this.databaseprovider.getBookmarkedPostsResult(uid);
    } else {
      func = this.databaseprovider.getAllPost()
    }

    func.then( data=> {
      console.log("DATA: ", data);
      this.currentUserId = uid;
      this.databaseprovider.getPostsBookmarked(uid).then(bookmarkedIds => {
        this.bookmarks = bookmarkedIds;

        this.bookmarked = [];
        for (let i=0; i<data.length; i++) {
          if(bookmarkedIds.indexOf(data[i].postId) >= 0) {
            this.bookmarked.push(true);
          } else {
            this.bookmarked.push(false);
          }
        }
        this.posts = data;
      })
    })
  }

  getBookmarked(postId) {
    if(this.bookmarks.indexOf(postId) >= 0) {
      return true;
    } else {
      return false;
    }
  }

  toggleBookmark(index) {
    console.log(this.posts, index);
    this.bookmarked[index] = !this.bookmarked[index];
    this.databaseprovider.setBookmarked(this.currentUserId, this.posts[index].postId, this.bookmarked[index]);
  }

  goToDescription( postId ) {
    console.log("POST SELECTED: ", postId)
    this.navCtrl.push(Description, { postId });
  }

  contactSeller(phone) {
    this.callNumber.callNumber(`${phone}`, true);
  }
}
