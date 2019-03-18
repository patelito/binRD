import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { P } from '@angular/core/src/render3';

// TODO: Get username in posts
const QUERY_GET_ALL_POSTS = "SELECT posts.id, posts.name, posts.price, posts.featuredImageData, users.username AS username, users.avatar AS avatar, users.phone AS phone FROM posts INNER JOIN users ON posts.userId = users.id";
// const QUERY_GET_BOOKMARKS = " ";
const QUERY_GET_DESCRIPTION = "SELECT posts.featuredImageData, posts.price, posts.name, users.username, posts.negotiable FROM posts WHERE posts.id = (?) INNER JOIN posts.userId = (users.id = (?))";
const QUERY_GET_ALL_CATEGORIES = "SELECT * FROM categories";
const QUEY_INSERT_NEW_POST = "INSERT INTO posts (name, description, price, userId, categoryId, featuredImageData) VALUES (?, ?, ?, ?, ?, ?)";
const QUERY_GET_POSTS_BY_IDS = "SELECT posts.name, posts.price, posts.featuredImageData, users.username FROM posts INNER JOIN users ON posts.userId = users.id WHERE posts.id IN (?)";
const QUERY_GET_MULTIMEDIA_FROM_POST = "SELECT mediaData FROM multimedia WHERE multimedia.postId = (?)";
const QUERY_GET_POST = "SELECT posts.name, posts.price, posts.description, posts.featuredImageData, users.username, users.avatar, users.phone FROM posts INNER JOIN users ON posts.userId = users.id WHERE posts.id = (?)";
const QUERY_GET_POSTS_BOOKMARKED_BY_USER = "SELECT postId FROM bookmarks WHERE userId = (?)";

const TEST_USER = 1;

@Injectable()
export class DatabaseProvider { 
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  constructor(public sqlitePorter: SQLitePorter, private storage: Storage, private sqlite: SQLite, private platform: Platform, private http: Http) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'binbin.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        this.database = db;
        this.storage.get('database_filled').then(val => {
          if (val) {
            this.databaseReady.next(true);
          } else {
            this.fillDatabase();
          }
        });
      });
    });
  }

  fillDatabase() {
    this.http.get('assets/dbsetup.sql')
      .map(res => res.text())
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
          })
          .catch(e => console.error(e));
      });
  }

  // Get categories
  getCategories() {
    return this.database.executeSql(QUERY_GET_ALL_CATEGORIES, []).then((data) => {
      let categories = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          categories.push({ name: data.rows.item(i).name, id: data.rows.item(i).id });
        }
      }
      return categories;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }
  
  // Add new post
  addPost(title, description, price, categoryId, images) {
    let data = [title, description, price, TEST_USER, categoryId, images[0]];
    return this.database.executeSql(QUEY_INSERT_NEW_POST, data).then(data => {
      console.log(data.rows)
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

  // Get all Posts
  getAllPost() {
    return this.database.executeSql(QUERY_GET_ALL_POSTS, []).then( data => {
        let posts = [];
        if ( data.rows.length > 0 ){
          for (var i = 0; i < data.rows.length; i++) {
            posts.push(
              { 
                postId: data.rows.item(i).id,
                title: data.rows.item(i).name, 
                price: data.rows.item(i).price, 
                image: data.rows.item(i).featuredImageData,
                username: data.rows.item(i).username,
                avatar: data.rows.item(i).avatar,
                phone: data.rows.item(i).phone
              })
          }
        }
        return posts;
      }, err => {
        console.log('Error fetching posts!: ', err)
        return [];
      });
  };

  // Get bookmarks from user
  // getBookmarks( idUser ) {
  //   const dataParam = [ idUser ];
  //   return this.database.executeSql(
  //     QUERY_GET_BOOKMARKS,
  //     dataParam
  //   ).then(data => {
  //     let bookmarks = [];
  //     if (data.rows.length) {
  //       for (let i = 0; i < data.rows.length; i++) {
  //         bookmarks.push(
  //           {
  //             title: data.rows.item(i).name,
  //             price: data.rows.item(i).price,
  //             image: data.rows.item(i).featuredImageData,
  //             username: data.rows.item(i).username,
  //           })
  //       }
  //     }
  //     return bookmarks;
  //   }, err => {
  //     console.log('Error fetching bookmarks!: ', err)
  //     return [];
  //   }); 
  // }

  // Get post by with specific ids
  getPostsByIds( arrIds ){
    let data = [arrIds.toString()];
    return this.database.executeSql(
      QUERY_GET_POSTS_BY_IDS,
      data
    ).then( data => {
      let posts = [];
      if (data.rows.length) {
        for (let i = 0; i < data.rows.length; i++) {
          posts.push(
            {
              title: data.rows.item(i).name,
              price: data.rows.item(i).price,
              image: data.rows.item(i).featuredImageData,
              username: data.rows.item(i).username,
              phoneSeller: data.rows.item(i).phone,
            })
        }
      }
      return posts;
    }, err => {
      console.log('Error fetching posts: ', err);
      return [];
    })
  }

  // Get multimedias fom post
  getMultimedias( postId ) {
    const data = [ postId ]; 
    return this.database.executeSql(
      QUERY_GET_MULTIMEDIA_FROM_POST,
      data
    ).then( data => {
      console.log("MEDIA: ", data)
      let multimedia = [];
      if (data.rows.length) {
        for (let i = 0; i < data.rows.length; i++) {
          multimedia.push(
          {
            image: data.rows.item(i).mediaData,
          })
        }
      };
      return multimedia;
    })
  };

  // Get specific post
  getPost( postId ){
    console.log("POSTIDD: ", postId)
    let data = [postId];
    return this.database.executeSql(
      QUERY_GET_POST,
      data
    ).then( data => {
      let post = {};
      let arrPost = []
      if (data.rows.length) {
        for (let i = 0; i < data.rows.length; i++) {
          arrPost.push(
            {
              title: data.rows.item(i).name,
              description: data.rows.item(i).description,
              price: data.rows.item(i).price,
              image: data.rows.item(i).featuredImageData,
              username: data.rows.item(i).username,
              avatar: data.rows.item(i).avatar,
            })
        }
        post = arrPost[0];
      }
      return post;
    }, err => {
      console.log('Error fetching posts: ', err);
      return [];
    })
  }

  // Get post bookmarked from a user
  getPostsBookmarked( idUser ) {
    const data = [ idUser ];
    return this.database.executeSql(
      QUERY_GET_POSTS_BOOKMARKED_BY_USER, 
      data
    ).then( data => {
      let posts = [];
      if( data.rows.length ) {
        for (let i = 0; i < data.rows.length; i++) {
          posts[i] = data.rows.item(i).postId;
        }
      }
      return posts;
    }, err => {
      console.log('Error fetching bookmarks');
      return [];
    })
  }

  // Get description from a specific posts
  getDescription( idPost, idUserPost ) {
    const dataParam = [idPost, idUserPost];
    return this.database.executeSql(
      QUERY_GET_DESCRIPTION,
      dataParam
    ).then(data => {
      let description = [];
      if (data.rows.length) {
        for (let i = 0; i < data.rows.length; i++) {
          description.push(
            {
              title: data.rows.item(i).name,
              negotiable: data.rows.item(i).negotiable,
              price: data.rows.item(i).price,
              image: data.rows.item(i).featuredImageData,
              username: data.rows.item(i).username,
            })
        }
      }
      return description;
    }, err => {
      console.log('Error fetching description!: ', err)
      return [];
    });
  }


}
