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

const QUERY_GET_ALL_POSTS = "SELECT posts.name, posts.price, posts.featuredImageData, (SELECT name FROM users WHERE users.id = posts.userId) AS username FROM posts";
const QUERY_GET_BOOKMARKS = "SELECT posts.featuredImageData, posts.price,posts. name, users.username FROM posts INNER JOIN posts.userId = (users.id = (?))";
const QUERY_GET_DESCRIPTION = "SELECT posts.featuredImageData, posts.price, posts.name, users.username, posts.negotiable FROM posts WHERE posts.id = (?) INNER JOIN posts.userId = (users.id = (?))";

@Injectable()
export class DatabaseProvider { 
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  constructor(public sqlitePorter: SQLitePorter, private storage: Storage, private sqlite: SQLite, private platform: Platform, private http: Http) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'bin.db',
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

<<<<<<< HEAD
  fillWithDummyData() {
    const user = this.database.executeSql(
      "INSERT INTO users (name, username, avatar, phone, password, email) \
        VALUES ('Jonathan', 'jtaveras', 'https://image.flaticon.com/icons/png/512/236/236832.png', '25622', '123', 'jt@mail.com')"
      ).then( data => { return data}, err => { console.log("ERROR: ", err)} );
      return user;
=======
  getCategories() {
    return this.database.executeSql("SELECT * FROM categories", []).then((data) => {
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

  addPost(title, description, price, categoryId, images) {
    let data = [title, description, price, categoryId, images[0]];
    return this.database.executeSql("INSERT INTO posts (name, description, price, categoryId, featuredImageData) VALUES (?, ?, ?, ?, ?)", data).then(data => {
      return data;
    }, err => {
      console.log('Error: ', err);
      return err;
    });
>>>>>>> 89728b3c008b2c820141d6a66462dc072547ced9
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

  // Get all Posts
  getAllPost() {
    return this.database.executeSql("SELECT posts.name, posts.price, posts.featuredImageData, (SELECT name FROM users WHERE users.id = posts.userId) AS username FROM posts").then( data => {
        let posts = [];
        if ( data.length ){
          for (let i = 0; i < data.length; i++) {
            posts.push(
              { 
                title: data.rows.item(i).name, 
                price: data.rows.item(i).price, 
                image: data.rows.item(i).featuredImageData,
                username: data.rows.item(i).username,
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
  getBookmarks( idUser ) {
    const dataParam = [ idUser ];
    return this.database.executeSql(
      QUERY_GET_BOOKMARKS,
      dataParam
    ).then(data => {
      let bookmarks = [];
      if (data.length) {
        for (let i = 0; i < data.length; i++) {
          bookmarks.push(
            {
              title: data.rows.item(i).name,
              price: data.rows.item(i).price,
              image: data.rows.item(i).featuredImageData,
              username: data.rows.item(i).username,
            })
        }
      }
      return bookmarks;
    }, err => {
      console.log('Error fetching bookmarks!: ', err)
      return [];
    }); 
  }

  // Get description from a specific posts
  getDescription( idPost, idUserPost ) {
    const dataParam = [idPost, idUserPost];
    return this.database.executeSql(
      QUERY_GET_DESCRIPTION,
      dataParam
    ).then(data => {
      let description = [];
      if (data.length) {
        for (let i = 0; i < data.length; i++) {
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
