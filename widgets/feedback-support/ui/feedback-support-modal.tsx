'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'

interface FeedbackSupportModalProps {
  open: boolean
  feedbackType: string
  feedbackDetails: string
  feedbackFollowUp: boolean
  feedbackSubmitting: boolean
  feedbackError: string
  onOpenChange: (open: boolean) => void
  onFeedbackTypeChange: (value: string) => void
  onFeedbackDetailsChange: (value: string) => void
  onFeedbackFollowUpChange: (value: boolean) => void
  onSubmit: () => void
}

export function FeedbackSupportModal({
  open,
  feedbackType,
  feedbackDetails,
  feedbackFollowUp,
  feedbackSubmitting,
  feedbackError,
  onOpenChange,
  onFeedbackTypeChange,
  onFeedbackDetailsChange,
  onFeedbackFollowUpChange,
  onSubmit,
}: FeedbackSupportModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Feedback & Support</DialogTitle>
          <DialogDescription>
            Help us improve AssistantAI with your feedback.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
          <p className="font-medium text-primary">Want to improve our product?</p>
          <Button variant="neutral" size="sm" className="mt-2">
            Take our simple survey
          </Button>
        </div>
        <div className="space-y-3">
          <p className="font-medium">What would you like to tell us?</p>
          <RadioGroup value={feedbackType} onValueChange={onFeedbackTypeChange}>
            <label className="flex items-center gap-2">
              <RadioGroupItem value="bug_report" />
              <span>Bug Report</span>
            </label>
            <label className="flex items-center gap-2">
              <RadioGroupItem value="feature_request" />
              <span>Feature Request</span>
            </label>
            <label className="flex items-center gap-2">
              <RadioGroupItem value="ux_feedback" />
              <span>User Experience Feedback</span>
            </label>
            <label className="flex items-center gap-2">
              <RadioGroupItem value="billing_membership" />
              <span>Suggestion and Membership</span>
            </label>
            <label className="flex items-center gap-2">
              <RadioGroupItem value="other" />
              <span>Other</span>
            </label>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <p className="font-medium">Can you give us more details?</p>
          <Textarea
            className="min-h-36"
            placeholder="Please describe your experience or share your ideas. The more specific you are, the better we can address your feedback."
            value={feedbackDetails}
            onChange={(e) => onFeedbackDetailsChange(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={feedbackFollowUp}
            onCheckedChange={(checked) => onFeedbackFollowUpChange(Boolean(checked))}
          />
          <span>Yes, I'd like to receive follow-up support via email.</span>
        </label>
        {feedbackError ? <p className="text-sm text-destructive">{feedbackError}</p> : null}
        <DialogFooter className="flex items-center justify-end gap-2 sm:justify-end">
          <Button variant="neutral" size="sm" className="min-w-24" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" className="min-w-24" onClick={onSubmit} disabled={feedbackSubmitting}>
            {feedbackSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
