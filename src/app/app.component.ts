import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router'; // Import RouterModule

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule], // Add RouterModule here
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'js-compiler';
}
