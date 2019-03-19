import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';

// TODO: Get username in posts
const QUERY_GET_ALL_POSTS = "SELECT posts.id, posts.name, posts.price, posts.featuredImageData, users.username AS username, users.avatar AS avatar, users.phone AS phone FROM posts INNER JOIN users ON posts.userId = users.id ORDER BY posts.id DESC";
const QUERY_GET_DESCRIPTION = "SELECT posts.featuredImageData, posts.price, posts.name, users.username, posts.negotiable FROM posts WHERE posts.id = (?) INNER JOIN posts.userId = (users.id = (?))";
const QUERY_GET_ALL_CATEGORIES = "SELECT * FROM categories";
const QUEY_INSERT_NEW_POST = "INSERT INTO posts (name, description, price, userId, categoryId, featuredImageData) VALUES (?, ?, ?, ?, ?, ?)";
const QUERY_INSERT_MEDIA = "INSERT INTO multimedia (postId, mediaData) VALUES (?, ?);";
const QUERY_GET_POSTS_BY_IDS = "SELECT posts.name, posts.price, posts.featuredImageData, users.username FROM posts INNER JOIN users ON posts.userId = users.id WHERE posts.id IN (?) ORDER BY posts.id DESC";
const QUERY_GET_MULTIMEDIA_FROM_POST = "SELECT mediaData FROM multimedia WHERE multimedia.postId = (?)";
const QUERY_GET_POST = "SELECT posts.name, posts.price, posts.description, posts.featuredImageData, users.username, users.avatar, users.phone FROM posts INNER JOIN users ON posts.userId = users.id WHERE posts.id = (?)";
const QUERY_GET_POSTS_BOOKMARKED_BY_USER = "SELECT postId FROM bookmarks WHERE userId = (?)";
const QUERY_POSTS_BY_CATEGORY = "SELECT posts.id, posts.name, posts.price, posts.featuredImageData, users.username AS username, users.avatar AS avatar, users.phone AS phone FROM posts INNER JOIN users ON posts.userId = users.id WHERE posts.categoryId = (?) ORDER BY posts.id DESC";
const QUERY_POSTS_BY_NAME = "SELECT posts.id, posts.name, posts.price, posts.featuredImageData, users.username AS username, users.avatar AS avatar, users.phone AS phone FROM posts INNER JOIN users ON posts.userId = users.id WHERE posts.name LIKE (?) ORDER BY posts.id DESC";
const QUERY_BOOKMARKED_POST_RES = "SELECT posts.id, posts.name, posts.price, posts.featuredImageData, users.username AS username, users.avatar AS avatar, users.phone AS phone FROM posts INNER JOIN users ON posts.userId = users.id WHERE posts.id IN (SELECT postId FROM bookmarks WHERE userId = (?)) ORDER BY posts.id DESC";
const QUERY_GET_POSTS_BY_USERID = "SELECT posts.id, posts.name, posts.price, posts.featuredImageData, users.username AS username, users.avatar AS avatar, users.phone AS phone FROM posts INNER JOIN users ON posts.userId = users.id WHERE posts.UserId = (?) ORDER BY posts.id DESC";

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
  getUserByUserId(userId: number){
    let data = [userId];
    return this.database.executeSql("SELECT * FROM USERS WHERE id =  (?)", data).then(data => {
      return {id: data.rows.item(0).id,
                    name: data.rows.item(0).name, 
                    username: data.rows.item(0).username, 
                    avatar: data.rows.item(0).avatar,
                    phone: data.rows.item(0).phone,
                    password: data.rows.item(0).password,
                    email: data.rows.item(0).email};
    }).catch(err => {
      console.log("It does not work", err);
      return err
    })
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

  getPostsByCategory(catId) {
    return this.database.executeSql(QUERY_POSTS_BY_CATEGORY, [catId]).then( data => {
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
      console.log('posts res', posts);
      return posts;
    }, err => {
      console.log('Error fetching posts!: ', err)
      return [];
    });
  }

  getBookmarkedPostsResult(userId) {
    return this.database.executeSql(QUERY_BOOKMARKED_POST_RES, [userId]).then( data => {
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
      console.log('posts res', posts);
      return posts;
    }, err => {
      console.log('Error fetching posts!: ', err)
      return [];
    });
  }

  getPostsByName(name) {
    return this.database.executeSql(QUERY_POSTS_BY_NAME, [`%${name}%`]).then( data => {
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
      console.log('posts res', posts);
      return posts;
    }, err => {
      console.log('Error fetching posts!: ', err)
      return [];
    });
  }
  
  // Add new post
  addPost(title, description, price, categoryId, images) {
    return this.storage.get('userid').then(uid => {
      let data = [title, description, price, uid, categoryId, images[0]];
      return this.database.executeSql(QUEY_INSERT_NEW_POST, data).then(data => {
        console.log(data)
        
        for(let i=0; i<images.length; i++) {
          this.database.executeSql(QUERY_INSERT_MEDIA, [data.insertId, images[i]]).then(d=> {
            console.log('media', d);
          }, err=> {
            console.error('errmedia', err);
            return err;
          });
        }
       
        return data;
      }, err => {
        console.log('Error: ', err);
        return err;
      });
    });
    
  }

  createUser(nombre, usuario, avatar, phone, password, email) {
    let data = [nombre, usuario, avatar, phone, password, email]
    return this.database.executeSql("INSERT INTO users (name, username, avatar, phone, password, email) VALUES (?, ?, ?, ?, ?, ?)", data).then(data => {
      return data;
    }, err => {
      console.log("Error: ", err)
    });
  }

  editUser(id, nombre, usuario, avatar, phone, password, email){
    let data = [nombre, usuario, avatar, phone, password, email, id];
    return this.database.executeSql("UPDATE users SET name = ?, username = ?, avatar = ?, phone = ?, password = ?, email = ? WHERE id = ? ",data).then(data => {
      return data;
    }, err => {
      console.log("Error: ", err)
    });
  }

  getUser(email, username) {
    let data = [email, username]
    return this.database.executeSql("SELECT * FROM users WHERE email = ? OR username = ? ", data).then(data => {
      return data;
    }, err => {
      console.log("Error: ", err)
    });
  }

  validateUser(username, password) {
    let data = [username, password]
    return this.database.executeSql("SELECT * FROM users WHERE username = ? AND password = ? ", data).then(data => {
      if(data.rows.length > 0)
      {
        this.storage.set('userid', data.rows.item(0).id);
        return true
      }
      return "Usuario o contrasena incorrecto"
    }, err => {
      console.log("Error: ", err)
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
  
  getPostsByUserId(userId: number) {
    return this.database.executeSql(QUERY_GET_POSTS_BY_USERID, [userId]).then( data => {
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
          posts.push(data.rows.item(i).postId);
        }
      }
      return posts;
    }, err => {
      console.log('Error fetching bookmarks');
      return [];
    })
  }

  setBookmarked(userId, postId, setBookmarked) {
    let query = ''
    if(setBookmarked) {
      query = 'INSERT INTO bookmarks(userId, postId) VALUES (?, ?)'
    } else {
      query = 'DELETE FROM bookmarks WHERE userId = (?) AND postId = (?)';
    }

    return this.database.executeSql(
      query, 
      [userId, postId]
    ).then( data => {
      console.log('BOOKMARK', userId, postId, setBookmarked);
      return data;
    }, err => {
      console.error('Error setting bookmark', err);
      return err;
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


/*CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR,
  username VARCHAR UNIQUE,
  avatar VARCHAR,
  phone VARCHAR,
  password VARCHAR,
  email VARCHAR
);*/
