import { Component } from '@angular/core';
import { MessagesService } from '../messages.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-reg',
  templateUrl: './reg.page.html',
  styleUrls: ['./reg.component.scss','../app.component.scss'],
})
export class RegComponent  {
  
  submitError: string = null;

  dataset: Details = {
    email: '',
    
  };

 
 
  constructor(private https: HttpClient,
    private readonly messagesService: MessagesService,) { }

async regEmail() {
  const loading = await this.messagesService.showLoading('Sending Mail...');
  await loading.present();
  this.https.post<Details>('email', this.dataset).subscribe(
     (res) => {
        this.dataset = res;
        console.log(this.dataset);
        alert('Email Sent successfully');
        this.dataset.email = '';
        
      },err=>{
        loading.dismiss();
        this.messagesService.showErrorToast('Mail Sending Failed');
      }, () => loading.dismiss());
  }

}

export interface Details {
  email: string;
}

