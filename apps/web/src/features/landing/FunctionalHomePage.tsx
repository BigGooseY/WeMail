import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { WemailBrandLockup } from "../../shared/WemailBrandLockup";
import { fetchPublicSystemHealth } from "./api";
import "./functional-home.css";

type FunctionalHomePageProps = {
  consoleHref: string;
  isAuthenticated: boolean;
  isSessionLoading?: boolean;
  onToggleTheme: () => void;
  theme: "light" | "dark";
};

type HealthState = "checking" | "healthy" | "unavailable";

const authenticatedTools = [
  { href: "/mail/list", label: "查看邮件", detail: "读取收件箱、搜索邮件并查看正文。", code: "01" },
  { href: "/accounts/list", label: "管理邮箱", detail: "创建和停用临时邮箱账号。", code: "02" },
  { href: "/api-keys", label: "API 密钥", detail: "创建受限密钥并接入自动化流程。", code: "03" },
  { href: "/system/settings", label: "系统设置", detail: "管理域名、额度与功能开关。", code: "04" }
] as const;

function HealthBadge() {
  const [state, setState] = useState<HealthState>("checking");

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      void fetchPublicSystemHealth()
        .then((payload) => {
          if (!cancelled) setState(payload.ok ? "healthy" : "unavailable");
        })
        .catch(() => {
          if (!cancelled) setState("unavailable");
        });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  const label = state === "healthy" ? "系统运行正常" : state === "unavailable" ? "状态检查暂不可用" : "正在检查服务";

  return (
    <span aria-label="系统健康状态" className="functional-home-health" data-state={state} role="status">
      <span aria-hidden="true" />
      {label}
    </span>
  );
}

export function FunctionalHomePage({
  consoleHref,
  isAuthenticated,
  isSessionLoading = false,
  onToggleTheme,
  theme
}: FunctionalHomePageProps) {
  const primaryHref = isAuthenticated ? consoleHref : "/login";
  const primaryLabel = isAuthenticated ? "进入邮件工作台" : isSessionLoading ? "登录或进入工作台" : "进入登录";

  return (
    <div className="functional-home">
      <header className="functional-home-header">
        <nav aria-label="首页导航" className="functional-home-nav">
          <Link className="functional-home-brand" to="/">
            <WemailBrandLockup compact detail={null} label="WeMail brand lockup" />
          </Link>
          <div className="functional-home-nav-links">
            <a href="#features">核心功能</a>
            <a href="https://doc.wemail.willxue.com" rel="noreferrer" target="_blank">部署文档</a>
          </div>
          <div className="functional-home-nav-actions">
            <button
              aria-label={theme === "dark" ? "切换到浅色主题" : "切换到深色主题"}
              className="functional-home-theme"
              onClick={onToggleTheme}
              type="button"
            >
              {theme === "dark" ? "浅色" : "深色"}
            </button>
            {isAuthenticated ? (
              <Link className="functional-home-button primary compact" to={consoleHref}>控制台</Link>
            ) : (
              <>
                <Link className="functional-home-button secondary compact" to="/login">登录</Link>
                <Link className="functional-home-button primary compact" to="/register">注册</Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main>
        <section className="functional-home-hero">
          <div className="functional-home-hero-copy">
            <p className="functional-home-eyebrow">BIGGOOSEHUB · WEMAIL</p>
            <h1>把临时邮箱变成<br />直接可用的收件工具</h1>
            <p className="functional-home-lead">
              创建邮箱、接收邮件、搜索正文和管理 API 都集中在一个工作台。页面只保留实际功能，不加载装饰性图表和高耗动画。
            </p>
            <div className="landing-cta-row functional-home-actions">
              <Link className="functional-home-button primary" to={primaryHref}>{primaryLabel}</Link>
              {!isAuthenticated ? <Link className="functional-home-button secondary" to="/register">立即开始</Link> : null}
            </div>
            <HealthBadge />
          </div>

          <aside aria-label="当前收件配置" className="functional-home-summary">
            <p>当前生产配置</p>
            <dl>
              <div><dt>收件域</dt><dd>inbox.biggoosehub.com</dd></div>
              <div><dt>邮件入口</dt><dd>Cloudflare Email Routing</dd></div>
              <div><dt>处理服务</dt><dd>wemail-production</dd></div>
              <div><dt>附件存储</dt><dd>未启用 R2</dd></div>
            </dl>
          </aside>
        </section>

        <section className="functional-home-features" id="features">
          <div className="functional-home-section-head">
            <p className="functional-home-eyebrow">常用入口</p>
            <h2>打开页面就能开始工作</h2>
          </div>
          <div className="functional-home-grid">
            {authenticatedTools.map((tool) => (
              <Link className="functional-home-tool" key={tool.href} to={isAuthenticated ? tool.href : `/login?next=${encodeURIComponent(tool.href)}`}>
                <span>{tool.code}</span>
                <h3>{tool.label}</h3>
                <p>{tool.detail}</p>
                <strong>打开 →</strong>
              </Link>
            ))}
          </div>
        </section>

        <section className="functional-home-bottom">
          <div>
            <p className="functional-home-eyebrow">READY</p>
            <h2>{isAuthenticated ? "继续处理你的邮件" : "登录后创建第一个邮箱"}</h2>
          </div>
          <div className="landing-cta-row functional-home-actions">
            <Link className="functional-home-button primary" to={primaryHref}>{isAuthenticated ? "进入控制台" : "进入登录"}</Link>
          </div>
        </section>
      </main>

      <footer className="functional-home-footer">
        <span>WeMail · functional production UI</span>
        <a aria-label="WeMail 文档中心" href="https://doc.wemail.willxue.com" rel="noreferrer" target="_blank">部署文档</a>
      </footer>
    </div>
  );
}
