import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { promise } from 'protractor';
import { messages } from 'src/app/constants/messages';
import { tables } from 'src/app/constants/tables';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-apart',
  templateUrl: './add-apart.component.html',
  styleUrls: ['./add-apart.component.scss'],
})
export class AddApartComponent implements OnInit {

  @Input() edificio = [];
  frmApartamento: FormGroup;

  constructor(
    private modalController: ModalController,
    private frmbuild: FormBuilder,
    private fbservice: FirebaseService,
    private utils: UtilsService
  ) { }

  ngOnInit() {
    this.initializateFrmApart();
  }

  closeModal():void {
    this.modalController.dismiss();
  }

  initializateFrmApart():void {
    this.frmApartamento = this.frmbuild.group({
      name: ['', [Validators.required]],
      edificios: [this.edificio, [Validators.required]],
      codigoEdificio: [this.edificio[0].codigo, [Validators.required]]
    });
  }

  async addApart():Promise<any> {
    if (!this.frmApartamento.valid) {
      this.utils.showToast(messages.INPUST_ERROR.REQUIRID, 1000).then(toasData => toasData.present());
    } else {
      await this.fbservice.guardarDatos(tables.APARTAMENTS, this.frmApartamento.value);
      this.modalController.dismiss();
    }
  }

  get name() {
    return this.frmApartamento.get("name");
  }
}