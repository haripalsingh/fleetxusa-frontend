'use client';

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://sandybrown-squirrel-472536.hostingersite.com/backend/api';

type SubmitStatus = { type: 'success' | 'error'; message: string } | null;

const INPUT_CLASS =
  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00a550] focus:border-[#00a550] outline-none transition-colors';

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  file: null as File | null,
};

export default function ContactForm() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      let response: Response;

      if (formData.file) {
        const body = new FormData();
        body.append('fullName', formData.fullName);
        body.append('email', formData.email);
        body.append('phone', formData.phone);
        body.append('subject', formData.subject);
        body.append('message', formData.message);
        body.append('file', formData.file);
        response = await fetch(`${API_BASE_URL}/contact.php`, {
          method: 'POST',
          body,
        });
      } else {
        const { file: _file, ...payload } = formData;
        response = await fetch(`${API_BASE_URL}/contact.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Invalid response from server');
      }

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({
          type: 'success',
          message:
            'Thank you for contacting us! We will get back to you within 1 business day.',
        });
        setFormData(EMPTY_FORM);
        const fileInput = document.getElementById(
          'contact-file'
        ) as HTMLInputElement | null;
        if (fileInput) fileInput.value = '';
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Failed to send message. Please try again.',
        });
      }
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="font-heading text-2xl font-semibold text-gray-900 mb-6">
        Send Us a Message
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="contact-fullName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contact-fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className={INPUT_CLASS}
            placeholder="John Doe"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="contact-email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="contact-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={INPUT_CLASS}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="contact-phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="contact-phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className={INPUT_CLASS}
              placeholder="(123) 456-7890"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-subject"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="contact-subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className={INPUT_CLASS}
            placeholder="How can we help you?"
          />
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className={`${INPUT_CLASS} resize-none`}
            placeholder="Please include your VIN (last 8 digits is okay) and the part number if you have it..."
          />
        </div>

        <div>
          <label
            htmlFor="contact-file"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Upload (Optional){' '}
            <span className="text-xs text-gray-500">
              - photos of the part/label/damage/invoice
            </span>
          </label>
          <input
            type="file"
            id="contact-file"
            name="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className={`${INPUT_CLASS} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#00a550]/10 file:text-[#00a550] hover:file:bg-[#00a550]/20`}
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Please do not include sensitive payment
            information (full card numbers) in your message.
          </p>
        </div>

        {submitStatus && (
          <div
            role={submitStatus.type === 'error' ? 'alert' : 'status'}
            className={`rounded-lg p-4 border ${
              submitStatus.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <p className="text-sm">{submitStatus.message}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#e9e611] to-[#00a34f] text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a550] focus:ring-offset-2 hover:opacity-90 transition-opacity disabled:bg-gray-400 disabled:bg-none disabled:opacity-100 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>

        <p className="text-sm text-gray-500 text-center">
          <strong>Response time:</strong> We typically respond within 1 business
          day.
        </p>
      </form>
    </div>
  );
}
