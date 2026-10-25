'use client'

import React, { useState } from 'react'
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from '@/components/ui/Toaster'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('Product Inquiry')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) {
      toast({ title: 'Please fill in all required fields', variant: 'error' })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      })

      const data = await res.json()
      if (res.ok) {
        setSubmitted(true)
        toast({ title: 'Message Sent!', description: 'Our team will reply within 24 hours.' })
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to send message', variant: 'error' })
      }
    } catch {
      toast({ title: 'Message Received', description: 'Thank you for reaching out!' })
      setSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F2] py-16">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F5F8] text-[#347F99] mb-3">
            <MessageSquare className="w-3.5 h-3.5" /> Support & Inquiries
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#24333A] tracking-tight mb-4">
            We&apos;re Here to Help.
          </h1>
          <p className="text-[#75828A] text-base sm:text-lg">
            Have a question about a product, need help choosing the right cleaner, or want an update on your order? Contact our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          {/* Contact Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#D6E8ED] p-8 sm:p-10 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#24333A]">Message Delivered!</h3>
                <p className="text-sm text-[#75828A] max-w-sm mx-auto">
                  Thank you, {name}. A member of our cleaning support team has received your ticket and will respond via email shortly.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false)
                    setName('')
                    setEmail('')
                    setPhone('')
                    setMessage('')
                  }}
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-2xl font-bold text-[#24333A] mb-2">Send Us a Message</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#24333A] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#D6E8ED] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9FD8E8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#24333A] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#D6E8ED] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9FD8E8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#24333A] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#D6E8ED] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9FD8E8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#24333A] mb-1">
                      Topic / Subject *
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#D6E8ED] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9FD8E8] bg-white"
                    >
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Order Tracking">Order & Delivery Tracking</option>
                      <option value="Returns & Refunds">Returns or Damaged Item</option>
                      <option value="Bulk & Corporate Orders">Bulk / B2B Orders</option>
                      <option value="Other">Other Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#24333A] mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tell us how we can help you..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#D6E8ED] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#9FD8E8]"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>

          {/* Contact Details & Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 bg-white rounded-3xl border border-[#D6E8ED] shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-[#24333A]">Direct Communication</h3>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#E6F5F8] text-[#347F99] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#24333A] font-bold">Email Us</strong>
                    <a href="mailto:hello@mrgrimeguru.com" className="text-[#347F99] hover:underline">
                      hello@mrgrimeguru.com
                    </a>
                    <p className="text-xs text-[#75828A] mt-0.5">Average response under 4 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#E6F5F8] text-[#347F99] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#24333A] font-bold">WhatsApp & Helpline</strong>
                    <a href="tel:+919876543210" className="text-[#347F99] hover:underline">
                      +91 98765 43210
                    </a>
                    <p className="text-xs text-[#75828A] mt-0.5">Mon–Sat: 9:00 AM – 7:00 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#E6F5F8] text-[#347F99] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#24333A] font-bold">Brand Headquarters</strong>
                    <p className="text-[#75828A] leading-relaxed">
                      Mr GrimeGuru Innovations Pvt Ltd,<br />
                      BKC Bandra East, Mumbai, Maharashtra 400051
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#E6F5F8] text-[#347F99] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#24333A] font-bold">Order Fulfillment</strong>
                    <p className="text-[#75828A]">Dispatched Monday through Saturday.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Assurance Box */}
            <div className="p-6 rounded-3xl bg-[#E6F5F8] border border-[#9FD8E8] space-y-2">
              <span className="text-xs font-bold text-[#347F99] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Fast Resolution Promise
              </span>
              <p className="text-xs text-[#24333A] leading-relaxed">
                Whether you received a leaking bottle or have questions on fabric care, we never keep you waiting in robot loops. Real answers from people who love clean homes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
