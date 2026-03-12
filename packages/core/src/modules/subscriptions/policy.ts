export type SubscriptionTier = "free";

export const topicCapByTier: Record<SubscriptionTier, number> = {
  free: 1,
};

export const isTopicCountAllowedByTier = (
  tier: SubscriptionTier,
  count: number,
) => count <= topicCapByTier[tier];
