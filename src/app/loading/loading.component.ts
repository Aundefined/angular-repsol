import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../_services/loading.service';

@Component({
  selector: 'app-loading-component',
  templateUrl: 'loading.component.html',
  styleUrls: ['./loading.component.css']
})

export class LoadingComponent {
  loading = {showLoading: false};
  constructor(private loadingService: LoadingService) { }

  ngOnInit() {
    this.loadingService.getLoading().subscribe(loading => {
      this.loading = loading;
    });
  }
}
