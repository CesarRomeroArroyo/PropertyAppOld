import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { promise } from 'selenium-webdriver';

import { messages } from 'src/app/constants/messages';
import { inputs } from '../../constants/inputs';
import { FirebaseService } from '../../services/firebase.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  frmAuth: FormGroup;
  check: boolean = false;

  constructor(
    private frservice: FirebaseService,
    private frmbuilder: FormBuilder,
    private utils: UtilsService,
    private loadCtrl: LoadingController,
    public afAuth: AngularFireAuth,
  ) { }

  ngOnInit() {
    this.initializeFormAuth();
  }

  initializeFormAuth(): void {
    this.frmAuth = this.frmbuilder.group({
      user: ['', [Validators.required, Validators.email, Validators.pattern(inputs.EMAIL)]],
      password: ['', [Validators.required]],
      check: false
    });
  }

  ionViewWillEnter() {
    this.utils.validedSession(this.frmAuth);
  }

  async login(): Promise<void> {
    if (!this.frmAuth.valid) {
      if (this.frmAuth.value == "") {
        this.utils.showToast(messages.login.EMPTYFIELDS, 3000).then(toasData => toasData.present());
      }
      this.utils.showToast(messages.login.ERROREMAIL, 3000).then(toasData => toasData.present());
    }
    else {
      const user = await this.frservice.login(this.frmAuth.value.user, this.frmAuth.value.password);
      let loader = this.loadCtrl.create({
        message: messages.information.WAIT
      });
      (await loader).present();
      await this.frservice.validationLogin(user, this.frmAuth);
      (await loader).dismiss();
    }
  }

}
