"use client"

import { useState } from "react"
import Link from "next/link"
import {
  MessageSquare,
  Activity,
  Calendar,
  FileText,
  Bell,
  Shield,
  Pill,
  Heart,
  TrendingUp,
  Video,
  ChevronRight,
  Crown,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardHeader from "@/components/dashboard-header"

// Mock data for the dashboard
const recentSymptoms = [
  { id: 1, name: "Headache", severity: "Mild", date: "2 days ago" },
  { id: 2, name: "Fatigue", severity: "Moderate", date: "3 days ago" },
  { id: 3, name: "Sore Throat", severity: "Mild", date: "1 week ago" },
]

const upcomingAppointments = [
  { id: 1, doctor: "Dr. Sarah Johnson", specialty: "General Practitioner", date: "May 15, 2025", time: "10:00 AM" },
  { id: 2, doctor: "Dr. Michael Chen", specialty: "Cardiologist", date: "May 22, 2025", time: "2:30 PM" },
]

const healthTips = [
  {
    id: 1,
    title: "Stay Hydrated",
    description: "Drink at least 8 glasses of water daily to maintain optimal health.",
    icon: Heart,
  },
  {
    id: 2,
    title: "Sleep Well",
    description: "Aim for 7-8 hours of quality sleep each night for better cognitive function.",
    icon: Activity,
  },
  {
    id: 3,
    title: "Regular Exercise",
    description: "30 minutes of moderate exercise 5 times a week can significantly improve your health.",
    icon: TrendingUp,
  },
]

const healthMetrics = {
  steps: { current: 8432, goal: 10000 },
  sleep: { current: 7.2, goal: 8 },
  heartRate: { average: 72 },
  bloodPressure: { systolic: 118, diastolic: 75 },
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex flex-col h-full animated-grid-bg">
      <DashboardHeader />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold gradient-text">Welcome back, Sarah</h1>
                <p className="text-white/70 mt-1">Here's an overview of your health dashboard</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <Link href="/chat">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Start AI Chat
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="glass-button">
                  <Bell className="mr-2 h-5 w-5" />
                  <span className="sr-only md:not-sr-only md:inline-block">Notifications</span>
                  <Badge className="ml-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white">3</Badge>
                </Button>
              </div>
            </div>
          </div>

          {/* Health Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Health Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-purple-500/20 p-2">
                    <Heart className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">87/100</div>
                    <p className="text-xs text-cyan-400">↑ 3 points since last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Daily Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-cyan-500/20 p-2">
                    <Activity className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <div className="text-2xl font-bold text-white">{healthMetrics.steps.current}</div>
                      <div className="text-sm text-white/50">Goal: {healthMetrics.steps.goal}</div>
                    </div>
                    <Progress
                      value={(healthMetrics.steps.current / healthMetrics.steps.goal) * 100}
                      className="h-2 bg-white/10"
                      indicatorClassName="bg-gradient-to-r from-cyan-500 to-purple-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-pink-500/20 p-2">
                    <Calendar className="h-6 w-6 text-pink-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{upcomingAppointments.length}</div>
                    <p className="text-xs text-white/70">Next: {upcomingAppointments[0].date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/70">Medication Adherence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-4 rounded-full bg-purple-500/20 p-2">
                    <Pill className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between mb-1">
                      <div className="text-2xl font-bold text-white">92%</div>
                      <div className="text-sm text-white/50">This month</div>
                    </div>
                    <Progress
                      value={92}
                      className="h-2 bg-white/10"
                      indicatorClassName="bg-gradient-to-r from-cyan-500 to-purple-500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="overview" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 md:w-[600px] bg-white/5 border border-white/10">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="symptoms"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
              >
                Symptoms
              </TabsTrigger>
              <TabsTrigger
                value="treatments"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
              >
                Treatments
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
              >
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* AI Chat Quick Access */}
                  <Card className="gradient-border bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="gradient-text">AI Health Assistant</CardTitle>
                      <CardDescription className="text-white/70">
                        Get personalized health guidance instantly
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-white/80">
                        Our AI can help you understand symptoms, provide health recommendations, and guide you to
                        appropriate care options.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Badge className="bg-white/10 hover:bg-white/20 text-white">Check symptoms</Badge>
                        <Badge className="bg-white/10 hover:bg-white/20 text-white">Medication info</Badge>
                        <Badge className="bg-white/10 hover:bg-white/20 text-white">Diet advice</Badge>
                        <Badge className="bg-white/10 hover:bg-white/20 text-white">Exercise tips</Badge>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link href="/chat">
                        <Button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white">
                          Start Chat Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>

                  {/* Recent Health Activity */}
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="gradient-text">Recent Health Activity</CardTitle>
                      <CardDescription className="text-white/70">
                        Your latest health interactions and records
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="mr-4 mt-1 rounded-full bg-cyan-500/20 p-1.5">
                            <MessageSquare className="h-4 w-4 text-cyan-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">AI Chat Consultation</p>
                            <p className="text-sm text-white/70">Discussed headache symptoms and possible causes</p>
                            <p className="text-xs text-white/50 mt-1">Yesterday at 2:34 PM</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="mr-4 mt-1 rounded-full bg-purple-500/20 p-1.5">
                            <FileText className="h-4 w-4 text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">Blood Test Results Uploaded</p>
                            <p className="text-sm text-white/70">Hemoglobin levels slightly below normal range</p>
                            <p className="text-xs text-white/50 mt-1">3 days ago</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="mr-4 mt-1 rounded-full bg-pink-500/20 p-1.5">
                            <Calendar className="h-4 w-4 text-pink-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">Appointment Scheduled</p>
                            <p className="text-sm text-white/70">General check-up with Dr. Sarah Johnson</p>
                            <p className="text-xs text-white/50 mt-1">1 week ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                        View All Activity
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Health Tips */}
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="gradient-text">Daily Health Tips</CardTitle>
                      <CardDescription className="text-white/70">Personalized recommendations for you</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {healthTips.map((tip) => (
                          <div key={tip.id} className="flex items-start">
                            <div className="mr-4 mt-1 rounded-full bg-cyan-500/20 p-1.5">
                              <tip.icon className="h-4 w-4 text-cyan-400" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{tip.title}</p>
                              <p className="text-sm text-white/70">{tip.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Premium Upgrade */}
                  <Card className="gradient-border bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center">
                        <Crown className="h-5 w-5 text-yellow-400 mr-2" />
                        <CardTitle className="gradient-text">Upgrade to Premium</CardTitle>
                      </div>
                      <CardDescription className="text-white/70">Unlock advanced health features</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-white/80">
                        <li className="flex items-center">
                          <div className="mr-2 h-4 w-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white text-xs">
                            ✓
                          </div>
                          Priority access to medical professionals
                        </li>
                        <li className="flex items-center">
                          <div className="mr-2 h-4 w-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white text-xs">
                            ✓
                          </div>
                          Advanced health analytics and insights
                        </li>
                        <li className="flex items-center">
                          <div className="mr-2 h-4 w-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center text-white text-xs">
                            ✓
                          </div>
                          Personalized health improvement plans
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white">
                        Upgrade Now
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="symptoms" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Symptom Tracker */}
                <div className="lg:col-span-2">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="gradient-text">Symptom Tracker</CardTitle>
                      <CardDescription className="text-white/70">
                        Track and monitor your symptoms over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Select Symptom</label>
                            <select className="w-full rounded-md glass-input p-2 text-sm">
                              <option>Headache</option>
                              <option>Fatigue</option>
                              <option>Fever</option>
                              <option>Cough</option>
                              <option>Nausea</option>
                              <option>Other</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Severity</label>
                            <select className="w-full rounded-md glass-input p-2 text-sm">
                              <option>Mild</option>
                              <option>Moderate</option>
                              <option>Severe</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white/80">Description</label>
                          <textarea
                            className="w-full rounded-md glass-input p-2 text-sm min-h-[100px]"
                            placeholder="Describe your symptoms in detail..."
                          ></textarea>
                        </div>

                        <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white">
                          Log Symptom
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Symptoms */}
                <div>
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="gradient-text">Recent Symptoms</CardTitle>
                      <CardDescription className="text-white/70">Your recently logged symptoms</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentSymptoms.map((symptom) => (
                          <div
                            key={symptom.id}
                            className="flex items-start border-b border-white/10 pb-3 last:border-0 last:pb-0"
                          >
                            <div className="mr-4 mt-1 rounded-full bg-pink-500/20 p-1.5">
                              <Activity className="h-4 w-4 text-pink-400" />
                            </div>
                            <div>
                              <div className="flex items-center">
                                <p className="font-medium text-white">{symptom.name}</p>
                                <Badge className="ml-2 bg-white/10 text-white text-xs">{symptom.severity}</Badge>
                              </div>
                              <p className="text-xs text-white/50 mt-1">{symptom.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 w-full">
                        View Symptom History
                      </Button>
                    </CardFooter>
                  </Card>

                  <div className="mt-6">
                    <Link href="/chat">
                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white">
                        <MessageSquare className="mr-2 h-5 w-5" />
                        Discuss Symptoms with AI
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="treatments" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current Treatments */}
                <div className="lg:col-span-2">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="gradient-text">Current Treatments</CardTitle>
                      <CardDescription className="text-white/70">
                        Your active medications and treatments
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start p-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
                          <div className="mr-4 rounded-full bg-cyan-500/20 p-2">
                            <Pill className="h-5 w-5 text-cyan-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                              <h4 className="font-medium text-white">Amoxicillin</h4>
                              <Badge className="mt-1 sm:mt-0 bg-cyan-500/20 text-cyan-300 self-start">Antibiotic</Badge>
                            </div>
                            <p className="text-sm text-white/70 mt-1">500mg, 3 times daily with food</p>
                            <div className="mt-2 flex items-center text-xs text-white/50">
                              <span>Started: May 1, 2025</span>
                              <span className="mx-2">•</span>
                              <span>Ends: May 10, 2025</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start p-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
                          <div className="mr-4 rounded-full bg-purple-500/20 p-2">
                            <Pill className="h-5 w-5 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                              <h4 className="font-medium text-white">Vitamin D Supplement</h4>
                              <Badge className="mt-1 sm:mt-0 bg-purple-500/20 text-purple-300 self-start">
                                Supplement
                              </Badge>
                            </div>
                            <p className="text-sm text-white/70 mt-1">1000 IU, once daily with breakfast</p>
                            <div className="mt-2 flex items-center text-xs text-white/50">
                              <span>Ongoing treatment</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="mr-2 glass-button">
                        Add Treatment
                      </Button>
                      <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                        Medication History
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                {/* Treatment Recommendations */}
                <div>
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="gradient-text">Treatment Recommendations</CardTitle>
                      <CardDescription className="text-white/70">Based on your health profile</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-sm">
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 text-cyan-400 mr-2" />
                            <h4 className="font-medium text-white">Omega-3 Supplements</h4>
                          </div>
                          <p className="text-sm text-white/70 mt-1">
                            May help with joint inflammation based on your symptoms
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
                          <div className="flex items-center">
                            <Activity className="h-4 w-4 text-purple-400 mr-2" />
                            <h4 className="font-medium text-white">Low-Impact Exercise</h4>
                          </div>
                          <p className="text-sm text-white/70 mt-1">
                            Swimming or walking may help with your joint pain
                          </p>
                        </div>

                        <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/20 backdrop-blur-sm">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 text-pink-400 mr-2" />
                            <h4 className="font-medium text-white">Allergy Testing</h4>
                          </div>
                          <p className="text-sm text-white/70 mt-1">
                            Consider testing based on your recurring symptoms
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link href="/chat">
                        <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Discuss with AI Assistant
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Health Records */}
                <div className="lg:col-span-2">
                  <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="gradient-text">Health Records</CardTitle>
                        <CardDescription className="text-white/70">Your secure medical history</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white flex items-center">
                          <Shield className="h-3 w-3 mr-1" />
                          Blockchain Secured
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start p-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
                          <div className="mr-4 rounded-full bg-cyan-500/20 p-2">
                            <FileText className="h-5 w-5 text-cyan-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                              <h4 className="font-medium text-white">Blood Test Results</h4>
                              <Badge className="mt-1 sm:mt-0 bg-white/10 text-white self-start">Lab Report</Badge>
                            </div>
                            <p className="text-sm text-white/70 mt-1">Complete blood count and metabolic panel</p>
                            <div className="mt-2 flex items-center text-xs text-white/50">
                              <span>Date: April 15, 2025</span>
                              <span className="mx-2">•</span>
                              <span>Dr. Michael Chen</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start p-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
                          <div className="mr-4 rounded-full bg-purple-500/20 p-2">
                            <FileText className="h-5 w-5 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                              <h4 className="font-medium text-white">Allergy Test Results</h4>
                              <Badge className="mt-1 sm:mt-0 bg-white/10 text-white self-start">
                                Specialist Report
                              </Badge>
                            </div>
                            <p className="text-sm text-white/70 mt-1">Skin prick test for common allergens</p>
                            <div className="mt-2 flex items-center text-xs text-white/50">
                              <span>Date: March 10, 2025</span>
                              <span className="mx-2">•</span>
                              <span>Dr. Emily Rodriguez</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start p-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
                          <div className="mr-4 rounded-full bg-pink-500/20 p-2">
                            <FileText className="h-5 w-5 text-pink-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                              <h4 className="font-medium text-white">Annual Physical Exam</h4>
                              <Badge className="mt-1 sm:mt-0 bg-white/10 text-white self-start">Check-up</Badge>
                            </div>
                            <p className="text-sm text-white/70 mt-1">
                              Routine physical examination and health assessment
                            </p>
                            <div className="mt-2 flex items-center text-xs text-white/50">
                              <span>Date: January 5, 2025</span>
                              <span className="mx-2">•</span>
                              <span>Dr. Sarah Johnson</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="mr-2 glass-button">
                        Upload New Record
                      </Button>
                      <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                        Request Records
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                {/* Upcoming Appointments */}
                <div>
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="gradient-text">Upcoming Appointments</CardTitle>
                      <CardDescription className="text-white/70">Your scheduled medical visits</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {upcomingAppointments.map((appointment, index) => (
                          <div
                            key={index}
                            className="p-3 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm"
                          >
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-cyan-400 mr-2" />
                              <h4 className="font-medium text-white">{appointment.doctor}</h4>
                            </div>
                            <p className="text-sm text-white/70 mt-1">{appointment.specialty}</p>
                            <div className="mt-2 flex items-center text-xs text-white/50">
                              <span>{appointment.date}</span>
                              <span className="mx-2">•</span>
                              <span>{appointment.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white">
                        Schedule New Appointment
                      </Button>
                      <Button variant="outline" className="w-full glass-button">
                        <Video className="mr-2 h-4 w-4" />
                        Start Telemedicine
                      </Button>
                    </CardFooter>
                  </Card>

                  <div className="mt-6">
                    <Card className="gradient-border bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="gradient-text">Health Data Integration</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-white/80 mb-3">
                          Connect your wearable devices and health apps to enhance your health tracking.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-white/10 text-white">Fitbit</Badge>
                          <Badge className="bg-white/10 text-white">Apple Health</Badge>
                          <Badge className="bg-white/10 text-white">Google Fit</Badge>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button variant="outline" className="w-full glass-button">
                          Connect Devices
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

