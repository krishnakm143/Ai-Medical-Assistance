import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DashboardService, Activity, HealthTip, Symptom, Medication, TreatmentPlan, MedicalRecord } from '../../services/dashboard.service';
import { UserService } from '../../services/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Tab {
  id: string;
  name: string;
  icon: string;
}

interface Appointment {
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  isVideo: boolean;
}

interface UserProfile {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  chronicConditions: string[];
  allergies: string[];
  familyHistory: string[];
  completionPercentage: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgFor
  ],
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  activeTab: string = 'overview';
  private destroy$ = new Subject<void>();
  
  tabs: Tab[] = [
    { id: 'overview', name: 'Overview', icon: 'fa-home' },
    { id: 'symptoms', name: 'Symptoms', icon: 'fa-clipboard-list' },
    { id: 'treatments', name: 'Treatments', icon: 'fa-pills' },
    { id: 'history', name: 'History', icon: 'fa-history' },
    { id: 'schedule', name: 'Schedule', icon: 'fa-calendar-alt' }
  ];

  activities: Activity[] = [];
  healthTips: HealthTip[] = [];
  symptoms: Symptom[] = [];
  medications: Medication[] = [];
  treatmentPlans: TreatmentPlan[] = [];
  medicalRecords: MedicalRecord[] = [];
  appointments: Appointment[] = [
    {
      doctorName: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: 'Tomorrow',
      time: '10:00 AM',
      isVideo: true
    },
    {
      doctorName: 'Dr. Michael Chen',
      specialty: 'General Practitioner',
      date: 'Next Week',
      time: '2:30 PM',
      isVideo: false
    }
  ];

  userProfile: UserProfile = {
    name: '',
    age: 0,
    gender: '',
    height: 0,
    weight: 0,
    chronicConditions: [],
    allergies: [],
    familyHistory: [],
    completionPercentage: 0
  };
  showProfileModal = false;

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Subscribe to all dashboard data
    this.dashboardService.getActivities()
      .pipe(takeUntil(this.destroy$))
      .subscribe(activities => this.activities = activities);

    this.dashboardService.getHealthTips()
      .pipe(takeUntil(this.destroy$))
      .subscribe(tips => this.healthTips = tips);

    this.dashboardService.getSymptoms()
      .pipe(takeUntil(this.destroy$))
      .subscribe(symptoms => this.symptoms = symptoms);

    this.dashboardService.getMedications()
      .pipe(takeUntil(this.destroy$))
      .subscribe(medications => this.medications = medications);

    this.dashboardService.getTreatmentPlans()
      .pipe(takeUntil(this.destroy$))
      .subscribe(plans => this.treatmentPlans = plans);

    this.dashboardService.getMedicalRecords()
      .pipe(takeUntil(this.destroy$))
      .subscribe(records => this.medicalRecords = records);

    // Initialize data if empty
    if (this.activities.length === 0) {
      const initialData = this.dashboardService.getInitialData();
      this.activities = initialData.activities;
      this.healthTips = initialData.healthTips;
      this.symptoms = initialData.symptoms;
      this.medications = initialData.medications;
      this.treatmentPlans = initialData.treatmentPlans;
      this.medicalRecords = initialData.medicalRecords;
    }

    // Reset profile details but keep the name from authentication
    this.resetUserProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openAIChat(context?: string): void {
    this.router.navigate(['/chat'], {
      queryParams: { context }
    });
  }

  updateMedicationStatus(medication: Medication): void {
    this.dashboardService.updateMedication(medication);
  }

  updateTreatmentProgress(plan: TreatmentPlan): void {
    this.dashboardService.updateTreatmentPlan(plan);
  }

  addNewSymptom(symptom: Symptom): void {
    this.dashboardService.addSymptom(symptom);
  }

  addNewActivity(activity: Activity): void {
    this.dashboardService.addActivity(activity);
  }

  addNewMedicalRecord(record: MedicalRecord): void {
    this.dashboardService.addMedicalRecord(record);
  }

  scheduleAppointment(appointment: Appointment): void {
    this.appointments.push(appointment);
    // You would typically save this to a service/backend
  }

  findDoctor(specialty: string): void {
    // Navigate to doctor finder or open modal
    this.openAIChat('find_doctor:' + specialty);
  }

  logHealthMetric(metricType: string, value: number): void {
    // This would typically send data to a service
    const activity: Activity = {
      icon: metricType === 'weight' ? 'fa-weight' : 
            metricType === 'blood-pressure' ? 'fa-heartbeat' : 
            metricType === 'glucose' ? 'fa-tint' : 'fa-chart-line',
      title: `Logged ${metricType}`,
      description: `Recorded a ${metricType} measurement of ${value}`,
      time: 'Just now'
    };
    this.addNewActivity(activity);
    // In a real app, this would update the health metrics visualizations
  }

  shareMedicalData(recordId: string, recipientType: string): void {
    // In a real app, this would integrate with secure sharing
    const activity: Activity = {
      icon: 'fa-share-alt',
      title: 'Shared Medical Data',
      description: `Securely shared record with ${recipientType}`,
      time: 'Just now'
    };
    this.addNewActivity(activity);
  }

  toggleNotifications(enabled: boolean): void {
    // This would handle notification preferences
    console.log(`Notifications ${enabled ? 'enabled' : 'disabled'}`);
    // In a real app, this would update user preferences
  }

  updateUserProfile(profile: Partial<UserProfile>): void {
    this.userProfile = { ...this.userProfile, ...profile };
    this.calculateCompletionPercentage();
    
    // In a real app, this would be saved to a service/database
    this.addActivity('Updated health profile', 'Profile information updated');
  }
  
  private calculateCompletionPercentage(): void {
    let fields = 0;
    let completed = 0;
    
    // Evaluate basic fields
    if (this.userProfile.name) { fields++; completed++; }
    if (this.userProfile.age > 0) { fields++; completed++; }
    if (this.userProfile.gender) { fields++; completed++; }
    if (this.userProfile.height > 0) { fields++; completed++; }
    if (this.userProfile.weight > 0) { fields++; completed++; }
    
    // Evaluate arrays
    fields += 3; // One field each for conditions, allergies, and family history
    if (this.userProfile.chronicConditions.length > 0) completed++;
    if (this.userProfile.allergies.length > 0) completed++;
    if (this.userProfile.familyHistory.length > 0) completed++;
    
    this.userProfile.completionPercentage = Math.round((completed / fields) * 100);
  }
  
  addCondition(condition: string): void {
    if (condition && !this.userProfile.chronicConditions.includes(condition)) {
      this.userProfile.chronicConditions.push(condition);
      this.updateUserProfile({});
      this.addActivity('Added health condition', `Added ${condition} to your health profile`);
    }
  }
  
  addAllergy(allergy: string): void {
    if (allergy && !this.userProfile.allergies.includes(allergy)) {
      this.userProfile.allergies.push(allergy);
      this.updateUserProfile({});
      this.addActivity('Added allergy', `Added ${allergy} to your health profile`);
    }
  }
  
  addFamilyHistory(history: string): void {
    if (history && !this.userProfile.familyHistory.includes(history)) {
      this.userProfile.familyHistory.push(history);
      this.updateUserProfile({});
      this.addActivity('Updated family history', `Added family history information to your profile`);
    }
  }
  
  removeCondition(condition: string): void {
    this.userProfile.chronicConditions = this.userProfile.chronicConditions.filter(c => c !== condition);
    this.updateUserProfile({});
  }
  
  removeAllergy(allergy: string): void {
    this.userProfile.allergies = this.userProfile.allergies.filter(a => a !== allergy);
    this.updateUserProfile({});
  }
  
  removeFamilyHistory(history: string): void {
    this.userProfile.familyHistory = this.userProfile.familyHistory.filter(h => h !== history);
    this.updateUserProfile({});
  }
  
  openProfileModal(): void {
    this.showProfileModal = true;
  }
  
  closeProfileModal(): void {
    this.showProfileModal = false;
  }
  
  openAIChatWithProfile(): void {
    const profileContext = JSON.stringify({
      name: this.userProfile.name,
      age: this.userProfile.age,
      gender: this.userProfile.gender,
      height: this.userProfile.height,
      weight: this.userProfile.weight,
      conditions: this.userProfile.chronicConditions,
      allergies: this.userProfile.allergies,
      familyHistory: this.userProfile.familyHistory
    });
    
    this.router.navigate(['/chat'], {
      queryParams: { context: `user_profile:${profileContext}` }
    });
  }
  
  private addActivity(title: string, description: string): void {
    const activity: Activity = {
      icon: 'fa-user-edit',
      title,
      description,
      time: 'Just now'
    };
    this.addNewActivity(activity);
  }

  /**
   * Resets the user profile to empty values but keeps the authenticated user's name
   */
  resetUserProfile(): void {
    const name = this.userService.getUserDisplayName();
    
    this.userProfile = {
      name: name,
      age: 0,
      gender: '',
      height: 0,
      weight: 0,
      chronicConditions: [],
      allergies: [],
      familyHistory: [],
      completionPercentage: 0
    };
    
    // Calculate completion percentage based on having a name from authentication
    this.calculateCompletionPercentage();
    
    // Add activity record for login
    if (name) {
      this.addNewActivity({
        icon: 'fa-sign-in-alt',
        title: 'Logged in',
        description: `${name} logged into the dashboard`,
        time: 'Just now'
      });
    }
  }
} 