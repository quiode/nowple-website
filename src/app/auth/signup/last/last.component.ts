import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-last',
  templateUrl: './last.component.html',
  styleUrls: ['./last.component.scss']
})
export class LastComponent implements OnInit {
  form = new FormGroup({});

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  submit() {
    // TODO
  }

  back() {
    this.router.navigate(['../2'], { relativeTo: this.route });
  }
}
