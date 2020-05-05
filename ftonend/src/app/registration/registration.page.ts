import {Component} from '@angular/core';
import {NavController} from '@ionic/angular';
import {HttpClient, HttpParams} from '@angular/common/http';
import {MessagesService} from '../messages.service';
import {create} from '@github/webauthn-json';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss','../app.component.scss'],
})
export class RegistrationPage {
  view = 'new';

  submitError: string = null;
  recoveryToken: string = null;

  constructor(private readonly navCtrl: NavController,
              private readonly messagesService: MessagesService,
              private readonly httpClient: HttpClient) {
  }

  registerNew(username: string, name:string, email:string) {
    this.register(username, name, email, null,  null);
  }

  registerAdd(registerAddToken: string) {
    this.register(null,null,null ,registerAddToken, null);
  }

  recover(recovery: string) {
    this.register(null,null,null, null, recovery);
  }

  private async register(username: string, name:string, email:string , registrationAddToken: string, recovery: string) {
    const loading = await this.messagesService.showLoading('Starting registration ...');
    await loading.present();

    let body = new HttpParams();
    if (username && name && email) {
      body = body.set('username', username);
      body = body.set('name', name);
      body = body.set('email', email);
    } else if (registrationAddToken) {
      body = body.set('registrationAddToken', registrationAddToken);
    } else if (recovery) {
      body = body.set('recoveryToken', recovery);
    }

    this.httpClient.post<RegistrationStartResponse>('registration/start', body)
      .subscribe(async (response) => {
        await loading.dismiss();
        if (response.status === 'OK') {
          await this.createCredentials(response);
        } else if (response.status === 'USERNAME_TAKEN') {
          this.submitError = 'usernameTaken';
        } else if (response.status === 'EMAIL_TAKEN') {
          this.submitError = 'emailTaken';
        } else if (response.status === 'TOKEN_INVALID') {
          if (registrationAddToken) {
            this.submitError = 'addTokenInvalid';
          } else {
            this.submitError = 'recoveryTokenInvalid';
          }
        }
      }, () => {
        loading.dismiss();
        this.messagesService.showErrorToast('Registration failed');
      }, () => loading.dismiss());
  }

  private async createCredentials(response) {
    const credential = await create({
      publicKey: response.publicKeyCredentialCreationOptions
    });

    try {
      // @ts-ignore
      credential.clientExtensionResults = credential.getClientExtensionResults();
    } catch (e) {
      // @ts-ignore
      credential.clientExtensionResults = {};
    }

    const credentialResponse = {
      registrationId: response.registrationId,
      credential
    };

    const loading = await this.messagesService.showLoading('Finishing registration ...');
    await loading.present();

    this.httpClient.post('registration/finish', credentialResponse, {responseType: 'text'})
      .subscribe(recoveryToken => {
        if (recoveryToken) {
          this.recoveryToken = recoveryToken;
        } else {
          this.messagesService.showErrorToast('Registration failed');
        }
      }, () => {
        loading.dismiss();
        this.messagesService.showErrorToast('Registration failed');
      }, () => loading.dismiss());
  }

}

interface RegistrationStartResponse {
  status: 'OK' | 'USERNAME_TAKEN' | 'TOKEN_INVALID' | 'EMAIL_TAKEN';
  registrationId?: string;
  publicKeyCredentialCreationOptions: any;
}

