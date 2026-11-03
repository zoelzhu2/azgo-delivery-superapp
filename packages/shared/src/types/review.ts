export type ReviewerRole = 'CUSTOMER' | 'DRIVER' | 'MERCHANT';
export type ReviewTargetType = 'DRIVER' | 'MERCHANT' | 'CUSTOMER';

export interface SingleReviewItem {
  targetType: ReviewTargetType;
  targetId?: string;
  targetName: string;
  rating: number; // 1-5 bintang
  tags: string[];
  comment?: string;
}

export interface OrderReviewRecord {
  id: string;
  orderNumber: string;
  serviceType?: string;
  reviewerRole: ReviewerRole;
  reviewerId?: string;
  reviewerName: string;
  targetType: ReviewTargetType;
  targetId?: string;
  targetName: string;
  rating: number;
  tags: string[];
  comment?: string;
  createdAt: string;
}

export interface OrderReviewSubmission {
  orderNumber: string;
  serviceType?: string;
  reviewerRole: ReviewerRole;
  reviewerId?: string;
  reviewerName: string;
  reviews: SingleReviewItem[];
}
