import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {DocChooser}from '../../widget/docChooser';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { CropDocComponent } from '../Components/crop-doc/crop-doc.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  imageResponse: any = [];
 modal:any;
 public profPic: any;
 profImg: boolean = false;
  constructor(private camera: Camera,public docChooser :DocChooser,public actionSheetController: ActionSheetController,public modalController: ModalController) { }

// multiple document upload
    getDocs() {
        let options = {
          maximumImagesCount: 10,
          // width: 200,
          //height: 200,
          quality: 25,
          outputType: 0
        };

        this.docChooser.getDocs(options).then(docs => {
          this.imageResponse = this.imageResponse.concat(docs);
        }) .catch(error => {
          console.log(error);
        })
    }

    async presentActionSheet() {
      if (this.profImg == false) {
      const actionSheet = await this.actionSheetController.create({
        header: 'Chooser',
        buttons: [{
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.getProfilePic(1)
          }
        }, {
          text: 'Gallery',
          icon: 'image',
          handler: () => {
            this.getProfilePic(0)
          }
        }, {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.profImg = true;
          }
        }]
      });
      await actionSheet.present();
    }
    else{
      this.modal = await this.modalController.create({
        component: CropDocComponent,
        cssClass: 'my-custom-modal-css',
        componentProps: {
          'doc': {doc:this.profPic,
          view:true}
        },showBackdrop:true, backdropDismiss: true
      });
      
      await this.modal.present();
      // console.log(await this.modal.onDidDismiss())
      let updateImg = await this.modal.onDidDismiss();
      if(updateImg.data.updateProfileIMAGE){
        this.profImg = false;
        this.presentActionSheet();
      }
    }
    }
  
// profile pic upload
    getProfilePic(srcTyp){
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        // targetWidth: 500,
        // targetHeight: 800,
        allowEdit: true,
        sourceType: srcTyp
      }
      
      this.docChooser.getProfilePic(options).then(docs => {
        // this.imageResponse = [];
        // this.imageResponse.push(docs);
        this.profPic = docs;
        this.profImg = true;
      }) .catch(error => {
        console.log(error);
      })
    }

    //to crop img/DOC
    CropImg(img){
      this.docChooser.CropImg(this.imageResponse,img).then(docs => {
        // this.imageResponse = [];
        this.imageResponse=docs;
      }) .catch(error => {
        console.log(error);
      })
    }

    //Remove Documents
    removeDoc(doc){
      this.imageResponse = this.imageResponse.filter(e => e !== doc);
  }

  //view Documents
  async Viewimg(img){
    this.modal = await this.modalController.create({
      component: CropDocComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        'doc': {doc:img,
        view:false}
      },showBackdrop:true, backdropDismiss: true
    });
    
    await this.modal.present();
  }


}
