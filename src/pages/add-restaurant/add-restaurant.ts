import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { File, Entry } from '@ionic-native/file';
import { Camera, CameraOptions  } from '@ionic-native/camera';
import { NgForm } from '@angular/forms';
import { RestauranteService } from '../../servicios/restaurante.service';

declare var cordova;

@IonicPage()
@Component({
  selector: 'page-add-restaurant',
  templateUrl: 'add-restaurant.html',
})
export class AddRestaurantPage {
  ubicacion = {
    lat: 0,
    lng: 0
  }
  ubicacionLista = false;
  imagenes:string[] = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private geolocation: Geolocation,
              public toastCtrl: ToastController,
              private camera: Camera,
              public restauranteServices: RestauranteService,
              public viewCtrl: ViewController,
              private file: File) {
  }

  localizar(){
    this.geolocation.getCurrentPosition({timeout:6000})
                    .then( info => {
                      this.ubicacion.lat = info.coords.latitude;
                      this.ubicacion.lng = info.coords.longitude;
                      this.ubicacionLista = true;
                    })
                    .catch(error => {
                      console.log(error);
                      let toast = this.toastCtrl.create({
                        message: "No se pudo encontrar la ubicación",
                        duration: 2000
                      });
                      toast.present();
                    })
  }

  tomarFoto(){

    const options: CameraOptions = {
      correctOrientation: true
    }

    this.camera.getPicture(options)
               .then(imagenInfo => {
                 //ruta antes del nmbre
                 let path = imagenInfo.substr(0, imagenInfo.lastIndexOf('/') + 1);
                 //nombre de la imagen con la extension
                 let nombre = imagenInfo.substr(imagenInfo.lastIndexOf('/') + 1);
                 let nuevoNombre = new Date().getMilliseconds() + '.jpg';
                 let newPath = cordova.file.dataDirectory;
                 this.file.moveFile(path, nombre, newPath, nuevoNombre)
                          .then((info:Entry) => {
                            this.imagenes.push(info.nativeURL);
                            this.camera.cleanup();
                          })
                          .catch(error => {
                            let toast = this.toastCtrl.create({
                              message: 'Ocurrió un error. File.moveFile',
                              duration: 3000
                            })
                            toast.present();
                            this.camera.cleanup();
                          })
               })
               .catch(error => {
                let toast = this.toastCtrl.create({
                  message: 'Ocurrió un error.',
                  duration: 3000
                })
                toast.present();
                this.camera.cleanup();
               })
  }

  agregarRestaurant(formulario: NgForm) {
    this.restauranteServices.agregarRestaurante(formulario.value.nombre,
                                                this.imagenes,
                                                formulario.value.rating,
                                                this.ubicacion)
    formulario.reset();
    this.ubicacionLista = false;
    this.imagenes = [];
    this.viewCtrl.dismiss();                                            
  }

}
