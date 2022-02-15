import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IntuneMAM } from '@ionic-enterprise/intune';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  version = null;
  src: string;

  constructor(private router: Router) { }

  async ionViewDidEnter() {
    this.version = (await IntuneMAM.sdkVersion()).version;
  }

  async login() {
    const authInfo = await IntuneMAM.acquireToken({
      scopes: ['https://graph.microsoft.com/.default'],
    });

    console.log('Got auth info', authInfo);

    await IntuneMAM.registerAndEnrollAccount({
      upn: authInfo.upn,
    });

    const user = await IntuneMAM.enrolledAccount();
    console.log('user', user);
    if (user.upn) {
      console.log('Got user, going home');
      this.router.navigate(['/home']);
    } else {
      console.log('No user, logging in');
      this.router.navigate(['/login']);
    }
  }

  async showConsole() {
    await IntuneMAM.displayDiagnosticConsole();
  }

  async pickPhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    const imageUrl = image.webPath;

    // Can be set to the src of an image now
    this.src = imageUrl;
  }

}
