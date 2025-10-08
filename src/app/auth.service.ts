import { Injectable, inject } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);
  private firestore = inject(Firestore);

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      const user = userCredential.user;

      if (user) {
        const adminDocRef = doc(this.firestore, 'admins', user.uid);
        const adminDoc = await getDoc(adminDocRef);

        if (adminDoc.exists()) {
          // Użytkownik jest administratorem, przekierowanie na stronę główną
          this.router.navigate(['/']);
        } else {
          // Użytkownik nie jest administratorem, wylogowanie
          alert('Nie masz uprawnień do zalogowania się.');
          await this.signOut();
        }
      }
    } catch (error) {
      console.error('Błąd logowania przez Google:', error);
    }
  }

  async signOut() {
    await signOut(this.auth);
    this.router.navigate(['/logowanie']); // Przekierowanie na stronę logowania
  }
}
