import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Activity {
  icon: string;
  title: string;
  description: string;
  time: string;
}

export interface HealthTip {
  icon: string;
  title: string;
  content: string;
}

export interface Symptom {
  name: string;
  severity: 'low' | 'medium' | 'high';
  duration: string;
  description: string;
}

export interface Medication {
  name: string;
  dosage: string;
  schedule: string;
  nextDose: string;
  taken?: boolean;
}

export interface TreatmentPlan {
  name: string;
  icon: string;
  description: string;
  duration: string;
  progress: number;
}

export interface MedicalRecord {
  title: string;
  icon: string;
  date: string;
  description: string;
  blockchainHash: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private activitiesSubject = new BehaviorSubject<Activity[]>([]);
  private healthTipsSubject = new BehaviorSubject<HealthTip[]>([]);
  private symptomsSubject = new BehaviorSubject<Symptom[]>([]);
  private medicationsSubject = new BehaviorSubject<Medication[]>([]);
  private treatmentPlansSubject = new BehaviorSubject<TreatmentPlan[]>([]);
  private medicalRecordsSubject = new BehaviorSubject<MedicalRecord[]>([]);

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData() {
    // Load data from localStorage
    const activities = localStorage.getItem('activities');
    if (activities) {
      this.activitiesSubject.next(JSON.parse(activities));
    }

    const healthTips = localStorage.getItem('healthTips');
    if (healthTips) {
      this.healthTipsSubject.next(JSON.parse(healthTips));
    }

    const symptoms = localStorage.getItem('symptoms');
    if (symptoms) {
      this.symptomsSubject.next(JSON.parse(symptoms));
    }

    const medications = localStorage.getItem('medications');
    if (medications) {
      this.medicationsSubject.next(JSON.parse(medications));
    }

    const treatmentPlans = localStorage.getItem('treatmentPlans');
    if (treatmentPlans) {
      this.treatmentPlansSubject.next(JSON.parse(treatmentPlans));
    }

    const medicalRecords = localStorage.getItem('medicalRecords');
    if (medicalRecords) {
      this.medicalRecordsSubject.next(JSON.parse(medicalRecords));
    }
  }

  getActivities(): Observable<Activity[]> {
    return this.activitiesSubject.asObservable();
  }

  getHealthTips(): Observable<HealthTip[]> {
    return this.healthTipsSubject.asObservable();
  }

  getSymptoms(): Observable<Symptom[]> {
    return this.symptomsSubject.asObservable();
  }

  getMedications(): Observable<Medication[]> {
    return this.medicationsSubject.asObservable();
  }

  getTreatmentPlans(): Observable<TreatmentPlan[]> {
    return this.treatmentPlansSubject.asObservable();
  }

  getMedicalRecords(): Observable<MedicalRecord[]> {
    return this.medicalRecordsSubject.asObservable();
  }

  addActivity(activity: Activity) {
    const activities = this.activitiesSubject.value;
    this.activitiesSubject.next([activity, ...activities]);
    localStorage.setItem('activities', JSON.stringify(this.activitiesSubject.value));
  }

  addSymptom(symptom: Symptom) {
    const symptoms = this.symptomsSubject.value;
    this.symptomsSubject.next([symptom, ...symptoms]);
    localStorage.setItem('symptoms', JSON.stringify(this.symptomsSubject.value));
  }

  updateMedication(medication: Medication) {
    const medications = this.medicationsSubject.value;
    const index = medications.findIndex(m => m.name === medication.name);
    if (index !== -1) {
      medications[index] = medication;
      this.medicationsSubject.next(medications);
      localStorage.setItem('medications', JSON.stringify(medications));
    }
  }

  updateTreatmentPlan(plan: TreatmentPlan) {
    const plans = this.treatmentPlansSubject.value;
    const index = plans.findIndex(p => p.name === plan.name);
    if (index !== -1) {
      plans[index] = plan;
      this.treatmentPlansSubject.next(plans);
      localStorage.setItem('treatmentPlans', JSON.stringify(plans));
    }
  }

  addMedicalRecord(record: MedicalRecord) {
    const records = this.medicalRecordsSubject.value;
    this.medicalRecordsSubject.next([record, ...records]);
    localStorage.setItem('medicalRecords', JSON.stringify(this.medicalRecordsSubject.value));
  }

  // Simulated data for initial state
  getInitialData() {
    return {
      activities: [
        {
          icon: 'fa-comment-medical',
          title: 'AI Consultation',
          description: 'Discussed symptoms and received recommendations',
          time: '2h ago'
        },
        {
          icon: 'fa-heartbeat',
          title: 'Health Check',
          description: 'Completed daily health assessment',
          time: '4h ago'
        },
        {
          icon: 'fa-pills',
          title: 'Medication Reminder',
          description: 'Took morning medication',
          time: '8h ago'
        }
      ],
      healthTips: [
        {
          icon: 'fa-apple-alt',
          title: 'Nutrition Tip',
          content: 'Include more leafy greens in your diet for better immune function.'
        },
        {
          icon: 'fa-running',
          title: 'Exercise Tip',
          content: 'Try to get at least 30 minutes of moderate exercise today.'
        },
        {
          icon: 'fa-moon',
          title: 'Sleep Tip',
          content: 'Aim for 7-9 hours of quality sleep for optimal health.'
        },
        {
          icon: 'fa-glass-water',
          title: 'Hydration Tip',
          content: 'Remember to drink water regularly throughout the day.'
        }
      ],
      symptoms: [
        {
          name: 'Mild Headache',
          severity: 'low' as const,
          duration: '2 days',
          description: 'Intermittent pain, mostly in the afternoon'
        },
        {
          name: 'Fatigue',
          severity: 'medium' as const,
          duration: '1 week',
          description: 'Feeling tired despite adequate sleep'
        }
      ],
      medications: [
        {
          name: 'Vitamin D3',
          dosage: '2000 IU',
          schedule: 'Once daily',
          nextDose: 'Today, 8:00 PM',
          taken: false
        },
        {
          name: 'Omega-3',
          dosage: '1000mg',
          schedule: 'Twice daily',
          nextDose: 'Tomorrow, 8:00 AM',
          taken: true
        }
      ],
      treatmentPlans: [
        {
          name: 'Exercise Program',
          icon: 'fa-dumbbell',
          description: 'Strength training and cardio routine',
          duration: '12 weeks',
          progress: 65
        },
        {
          name: 'Sleep Improvement',
          icon: 'fa-moon',
          description: 'Better sleep habits and routine',
          duration: '4 weeks',
          progress: 80
        }
      ],
      medicalRecords: [
        {
          title: 'Annual Check-up',
          icon: 'fa-stethoscope',
          date: '2024-02-15',
          description: 'Complete physical examination and blood work',
          blockchainHash: '0x7f4e6c8d...'
        },
        {
          title: 'Vaccination Record',
          icon: 'fa-syringe',
          date: '2024-01-20',
          description: 'COVID-19 booster shot',
          blockchainHash: '0x3a2b1c9e...'
        }
      ]
    };
  }
} 