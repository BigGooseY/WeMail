import { AlertTriangle, Building2, Gauge, RefreshCw, ShieldCheck, Users } from "lucide-react";

import type { CommercialModelSummary, PlanTierSummary } from "@wemail/shared";

import { Badge } from "../../shared/badge";
import { Button } from "../../shared/button";
import { LoadingState } from "../../shared/spinner";

type CommercialModelPanelProps = {
  commercial: CommercialModelSummary | null;
  errorMessage?: string | null;
  isLoading?: boolean;
  onRetry?: () => void;
};

function formatPlanName(planId: PlanTierSummary["id"]) {
  if (planId === "team") return "团队版";
  if (planId === "pro") return "高级版";
  return "免费版";
}

export function CommercialModelPanel({ commercial, errorMessage = null, isLoading = false, onRetry }: CommercialModelPanelProps) {
  const statusLabel = errorMessage ? "暂不可用" : commercial ? formatPlanName(commercial.currentPlanId) : "加载中";

  return (
    <section aria-label="商业与团队模型" className="panel workspace-card users-settings-panel users-commercial-panel">
      <div className="users-settings-panel-head">
        <div>
          <p className="panel-kicker">商业化</p>
        </div>
        <Badge variant={errorMessage ? "warning" : commercial?.currentPlanId === "team" ? "brand" : "info"}>{statusLabel}</Badge>
      </div>

      {errorMessage ? (
        <div className="users-commercial-error" role="alert">
          <AlertTriangle aria-hidden="true" size={18} strokeWidth={1.8} />
          <div>
            <strong>商业化摘要暂时没有返回</strong>
            <p>{errorMessage}</p>
          </div>
          {onRetry ? (
            <Button leadingIcon={<RefreshCw aria-hidden="true" size={15} />} onClick={onRetry} size="sm" variant="secondary">
              重试
            </Button>
          ) : null}
        </div>
      ) : commercial ? (
        <>
          <div className="users-commercial-usage-grid" aria-label="组织级用量">
            <div>
              <Users size={17} strokeWidth={1.8} aria-hidden="true" />
              <span>成员</span>
              <strong>{commercial.quotaUsage.activeUsers} / {commercial.quotaUsage.users}</strong>
            </div>
            <div>
              <Building2 size={17} strokeWidth={1.8} aria-hidden="true" />
              <span>共享邮箱</span>
              <strong>{commercial.quotaUsage.mailboxes} / {commercial.quotaUsage.mailboxLimit}</strong>
            </div>
            <div>
              <Gauge size={17} strokeWidth={1.8} aria-hidden="true" />
              <span>今日发信</span>
              <strong>{commercial.quotaUsage.outboundSentToday} / {commercial.quotaUsage.outboundDailyLimit}</strong>
            </div>
            <div>
              <ShieldCheck size={17} strokeWidth={1.8} aria-hidden="true" />
              <span>API 调用</span>
              <strong>{commercial.quotaUsage.apiCallsToday} / {commercial.quotaUsage.apiDailyLimit}</strong>
            </div>
          </div>

          <div className="users-commercial-plan-grid" aria-label="套餐层级">
            {commercial.planTiers.map((tier) => (
              <article
                className="users-commercial-plan"
                data-active={tier.id === commercial.currentPlanId}
                data-plan={tier.id}
                key={tier.id}
              >
                <div>
                  <strong>{tier.name}</strong>
                  <Badge variant={tier.id === commercial.currentPlanId ? "brand" : "neutral"}>
                    {tier.id === commercial.currentPlanId ? "当前" : tier.priceLabel}
                  </Badge>
                </div>
                <p>{tier.mailboxLimit} 个邮箱 · {tier.retentionDays} 天保留 · {tier.teamSeats} 席位</p>
              </article>
            ))}
          </div>
        </>
      ) : isLoading ? (
        <LoadingState className="users-commercial-loading" label="正在加载套餐和组织级用量" size="sm" />
      ) : (
        <p className="empty-state">套餐和组织级用量尚未加载。</p>
      )}
    </section>
  );
}
