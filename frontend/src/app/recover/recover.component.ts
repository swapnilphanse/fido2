import { Component } from '@angular/core';
import { MessagesService } from '../messages.service';
import {NavController} from '@ionic/angular';
import { HttpClient, HttpParams } from '@angular/common/http';
import {create} from '@github/webauthn-json';

@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss','../app.component.scss'],
})
export class RecoverComponent {
  view = 'recover';
  submitError: string = null;
  recoveryToken: string = null;

  constructor( private readonly navCtrl: NavController,
        private readonly messagesService: MessagesService,
              private readonly httpClient: HttpClient) { }

 
  recover(recovery:string) {
    this.register(null,recovery);
  }

  registerAdd(registerAddToken: string) {
    this.register(registerAddToken,null);
  }

  private async register(registrationAddToken: string,recovery:string) {
    const loading = await this.messagesService.showLoading('Starting registration ...');
    await loading.present();

    let body = new HttpParams();
   
    if (registrationAddToken) {
      body = body.set('registrationAddToken', registrationAddToken);
    } else if (recovery) {
      body = body.set('recoveryToken', recovery);
    }
      // body = body.set('recoveryToken', recovery);
    

    this.httpClient.post<RegistrationStartResponse>('registration/start', body)
      .subscribe(async (response) => {
        await loading.dismiss();
        if (response.status === 'OK') {
          await this.createCredentials(response);
        } if (registrationAddToken) {
          this.submitError = 'addTokenInvalid';
        } else {
          this.submitError = 'recoveryTokenInvalid';
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
  status: 'OK' | 'TOKEN_INVALID' ;
  registrationId?: string;
  publicKeyCredentialCreationOptions: any;
}