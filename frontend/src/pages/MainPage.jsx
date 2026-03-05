import "./MainPage.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import Logo from "../assets/logo.svg?react";

import CatalogIcon from "../assets/icons/catalog.svg?react";
import CheckIcon from "../assets/icons/check.svg?react";
import FileIcon from "../assets/icons/file.svg?react";
import CertiIcon from "../assets/icons/certi.svg?react";
import TimeIcon from "../assets/icons/time2.svg?react";
import DashboardIcon from "../assets/icons/icon.svg?react";

const NAV = [
  { href: "#roles", label: "Возможности" },
  { href: "#functions", label: "Функции" },
  { href: "#process", label: "Процесс" },
  { href: "#about", label: "О платформе" },
];

const FEATURES = [
  {
    label: "Бюджет и договоры",
    desc: "Контроль лимитов и привязка заявок",
    Icon: FileIcon,
  },
  {
    label: "Каталог тренингов",
    desc: "Выбор курсов и расписания",
    Icon: CatalogIcon,
  },
  {
    label: "Процесс заявок",
    desc: "Согласование и статусы",
    Icon: CheckIcon,
  },
  {
    label: "Посещаемость",
    desc: "Фиксация участия и прогресса",
    Icon: TimeIcon,
  },
  {
    label: "Сертификаты",
    desc: "Хранение документов в профиле",
    Icon: CertiIcon,
  },
  {
    label: "Аналитика",
    desc: "Отчёты по обучению и бюджету",
    Icon: DashboardIcon,
  },
];

const PROCESS_STEPS = [
  {
    role: "Руководитель",
    title: "Выбирает тренинг",
    desc: "Открывает каталог, выбирает подходящий курс и дату",
  },
  {
    role: "Руководитель",
    title: "Добавляет сотрудников",
    desc: "Выбирает кого из своего отдела отправить на обучение",
  },
  {
    role: "HR-менеджер",
    title: "Проверяет бюджет",
    desc: "Видит остаток по договорам и привязывает заявку",
  },
  {
    role: "HR-менеджер",
    title: "Одобряет заявку",
    desc: "Сотрудники зачислены, бюджет списан с договора",
  },
  {
    role: "Результат",
    title: "Сертификат в профиле",
    desc: "HR отмечает посещаемость и загружает удостоверения",
  },
];

export default function MainPage() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const animated = document.querySelectorAll(".vsAnim");

    if (prefersReducedMotion) {
      animated.forEach((el) => {
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!(entry.target instanceof HTMLElement)) return;
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    animated.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleAnchorClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      if (href && href.length > 1) {
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return (
    <div className="mainPage">
      <header className="vsHeader">
        <div className="vsContainer vsHeader-inner">
          <a href="/" className="vsBrand" aria-label="Nexus">
            <span className="vsBrand-mark" aria-hidden="true">
              <Logo className="logoIcon logoIcon--header" />
            </span>
            <span className="vsBrand-text">Nexus</span>
          </a>

          <nav className="vsNav" aria-label="Навигация">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="vsNav-link">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="vsHeader-actions">
            <Link to="/login" className="vsLoginButton">
              Войти
            </Link>
            <Link to="/register" className="vsStartButton">
              Начать <span className="vsStartButton-arrow">→</span>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section
          className="vsHero vsAnchor"
          id="capabilities"
          aria-labelledby="hero-title"
        >
          <div className="vsContainer vsHero-inner">
            <div className="vsHero-left vsAnim vsAnim--1">
              <h1 className="vsHero-title" id="hero-title">
                <span className="vsHero-titleLine vsHero-titleMain">Обучение,</span>
                <span className="vsHero-titleLine">
                  которое <span className="vsAccent">видно</span>
                </span>
                <span className="vsHero-titleLine vsHero-titleLineItalic">
                  <span className="vsHero-accentItalic">и измеримо</span>
                </span>
              </h1>

              <p className="vsHero-text vsAnim vsAnim--2">
                Единая система управления очным корпоративным обучением.{" "}
                <span className="vsAccent-inline">Заявки</span>,{" "}
                <span className="vsAccent-inline">договоры</span>,{" "}
                <span className="vsAccent-inline">бюджет</span>, посещаемость и
                сертификаты — вместо Excel и почты.
              </p>

              <div className="vsHero-metrics vsAnim vsAnim--3" aria-label="Метрики">
                <div className="vsMetric">
                  <div className="vsMetric-value">2 400</div>
                  <div className="vsMetric-label">сотрудников</div>
                </div>
                <div className="vsMetric-divider" aria-hidden="true" />
                <div className="vsMetric">
                  <div className="vsMetric-value">340+</div>
                  <div className="vsMetric-label">тренингов в год</div>
                </div>
                <div className="vsMetric-divider" aria-hidden="true" />
                <div className="vsMetric">
                  <div className="vsMetric-value">₸28M</div>
                  <div className="vsMetric-label">бюджет обучения</div>
                </div>
              </div>
            </div>

            <div className="vsHero-right vsAnim vsAnim--4" aria-hidden="true">
              <div className="vsHero-card">
                <div className="vsPreview">
                  <div className="vsPreview-top">
                    <div className="vsMiniMetric">
                      <div className="vsMiniMetric-value">76%</div>
                      <div className="vsMiniMetric-label">в срок</div>
                    </div>
                    <div className="vsMiniMetric">
                      <div className="vsMiniMetric-value">18</div>
                      <div className="vsMiniMetric-label">заявок</div>
                    </div>
                    <div className="vsMiniMetric">
                      <div className="vsMiniMetric-value">12</div>
                      <div className="vsMiniMetric-label">тренингов</div>
                    </div>
                  </div>

                  <div className="vsPreview-table">
                    <div className="vsRow vsRow--head">
                      <div>Тренинг</div>
                      <div>Заявка</div>
                      <div className="vsRow-right">Статус</div>
                    </div>

                    <div className="vsRow">
                      <div className="vsCell-line" />
                      <div className="vsCell-line vsCell-line--short" />
                      <div className="vsRow-right">
                        <span className="vsStatus vsStatus--ok">Готово</span>
                      </div>
                    </div>
                    <div className="vsRow">
                      <div className="vsCell-line" />
                      <div className="vsCell-line vsCell-line--short" />
                      <div className="vsRow-right">
                        <span className="vsStatus vsStatus--warn">Ожидает</span>
                      </div>
                    </div>
                    <div className="vsRow">
                      <div className="vsCell-line" />
                      <div className="vsCell-line vsCell-line--short" />
                      <div className="vsRow-right">
                        <div className="vsCell-line vsCell-line--tiny" />
                      </div>
                    </div>
                    <div className="vsRow">
                      <div className="vsCell-line" />
                      <div className="vsCell-line vsCell-line--short" />
                      <div className="vsRow-right">
                        <div className="vsCell-line vsCell-line--tiny" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="vsHero-scrollHint vsAnim" aria-hidden="true">
              <span>Прокрути вниз</span>
              <span className="vsHero-scrollArrow">↓</span>
            </div>
          </div>
        </section>

        <section
          className="vsRoles vsAnchor"
          id="roles"
          aria-labelledby="roles-title"
        >
          <div className="vsContainer vsRoles-inner">
            <div className="vsRoles-head vsAnim">
              <h2 className="vsSectionTitle" id="roles-title">
                Каждый видит только <span className="vsAccent-roles">своё</span>
              </h2>
              <p className="vsSectionSubtitle">
                Роли и доступы настроены так, чтобы каждый участник процесса
                работал только со своей частью — без лишних таблиц и пересылок.
              </p>
            </div>

            <div className="vsRoles-grid">
              <article className="vsRoleCard vsAnim vsRoleCard--hr">
                <h3 className="vsRoleCard-title">HR-менеджер</h3>
                <div className="vsRoleCard-label vsRoleCard-labelPurple">
                  Администратор обучения
                </div>
                <p className="vsRoleCard-desc">
                  Полный контроль над системой: договоры, бюджет, заявки и результаты обучения всей компании.
                </p>
                <ul className="vsRoleCard-list">
                  <li><span className="vsRoleCard-check" aria-hidden="true">✓</span>Реестр поставщиков и договоров</li>
                  <li><span className="vsRoleCard-check" aria-hidden="true">✓</span>Каталог тренингов и расписание</li>
                  <li><span className="vsRoleCard-check" aria-hidden="true">✓</span>Одобрение заявок и привязка к договору</li>
                  <li><span className="vsRoleCard-check" aria-hidden="true">✓</span>Журнал посещаемости</li>
                  <li><span className="vsRoleCard-check" aria-hidden="true">✓</span>Загрузка сертификатов слушателям</li>
                  <li><span className="vsRoleCard-check" aria-hidden="true">✓</span>Аналитика и выгрузка отчётов</li>
                </ul>
              </article>

              <article className="vsRoleCard vsAnim vsRoleCard--mgr">
                <h3 className="vsRoleCard-title">Руководитель</h3>
                <div className="vsRoleCard-label vsRoleCard-labelGreen">
                  Заказчик обучения
                </div>
                <p className="vsRoleCard-desc">
                  Управляет обучением своего отдела: выбирает тренинги, подаёт заявки, следит за сертификатами команды.
                </p>
                <ul className="vsRoleCard-list">
                  <li><span className="vsRoleCard-check" aria-hidden="true">✓</span>Каталог доступных тренингов</li>
                  <li><span className="vsRoleCard-check" aria-hidden="true">✓</span>Подача заявки с выбором сотрудников</li>
                  <li><span className="vsRoleCard-check" aria-hidden="true">✓</span>Отслеживание статуса своих заявок</li>
                  <li><span className="vsRoleCard-check" aria-hidden="true">✓</span>Просмотр прогресса обучения отдела</li>
                  <li><span className="vsRoleCard-check" aria-hidden="true">✓</span>Уведомления об истекающих сертификатах</li>
                </ul>
              </article>

              <article className="vsRoleCard vsAnim vsRoleCard--emp">
                <h3 className="vsRoleCard-title">Сотрудник</h3>
                <div className="vsRoleCard-label vsRoleCard-labelBlue">
                  Слушатель
                </div>
                <p className="vsRoleCard-desc">
                  Видит своё расписание обучений, получает напоминания и хранит все сертификаты в одном месте.
                </p>
                <ul className="vsRoleCard-list">
                  <li><span className="vsRoleCard-check" aria-hidden="true">✓</span>Личный кабинет с историей обучений</li>
                  <li><span className="vsRoleCard-check" aria-hidden="true">✓</span>Расписание предстоящих тренингов</li>
                  <li><span className="vsRoleCard-check" aria-hidden="true">✓</span>Все сертификаты и удостоверения</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section
          className="vsFeatures vsAnchor"
          id="functions"
          aria-labelledby="features-title"
        >
          <div className="vsContainer vsFeatures-inner">
            <h2 className="vsFeatures-title vsAnim" id="features-title">
              Всё для управления корпоративным обучением
            </h2>

            <div className="vsFeatures-grid" aria-label="Функции платформы">
              {FEATURES.map(({ label, desc, Icon }) => (
                <div key={label} className="vsFeatureTile vsAnim">
                  <Icon className="vsFeatureTile-icon" aria-hidden="true" />
                  <div className="vsFeatureTile-title">{label}</div>
                  <div className="vsFeatureTile-desc">{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="vsProcess vsAnchor" id="process" aria-labelledby="process-title">
          <div className="vsContainer vsProcess-inner">
            <div className="vsProcess-kicker vsAnim">КАК ЭТО РАБОТАЕТ</div>
            <h2 className="vsProcess-title vsAnim" id="process-title">
              От <span className="vsAccent-process">заявки</span> до{" "}
              <span className="vsAccent-process">сертификата</span>
            </h2>

            <div className="vsProcess-steps" aria-label="Шаги процесса">
              {PROCESS_STEPS.map((step, index) => (
                <div key={`${step.role}-${step.title}`} className="vsStep vsAnim">
                  <div className="vsStep-dot" aria-hidden="true">
                    <span className="vsStep-index">{index + 1}</span>
                  </div>
                  <div className="vsStep-role">{step.role}</div>
                  <div className="vsStep-title">{step.title}</div>
                  <div className="vsStep-desc">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="vsStats vsAnchor" id="about" aria-labelledby="stats-title">
          <div className="vsContainer vsStats-inner">
            <div className="vsStats-head vsAnim">
              <h2 className="vsStats-title" id="stats-title">О платформе</h2>
            </div>

            <div className="vsStats-grid">
              <article className="vsStatCard vsAnim">
                <div className="vsStatCard-number">
                  2<span className="vsStatCard-unit">400</span>
                </div>
                <div className="vsStatCard-label">Сотрудников на платформе</div>
                <div className="vsStatCard-sub">Включая ДЗО</div>
              </article>
              <article className="vsStatCard vsAnim">
                <div className="vsStatCard-number">
                  340<span className="vsStatCard-unit">+</span>
                </div>
                <div className="vsStatCard-label">Тренингов в год</div>
                <div className="vsStatCard-sub">Очных и онлайн</div>
              </article>
              <article className="vsStatCard vsAnim">
                <div className="vsStatCard-number">
                  ₸<span className="vsStatCard-unit"> 28M</span>
                </div>
                <div className="vsStatCard-label">Бюджет обучения</div>
                <div className="vsStatCard-sub">Под контролем системы</div>
              </article>
              <article className="vsStatCard vsAnim">
                <div className="vsStatCard-number">
                  0<span className="vsStatCard-unit"> xlsx</span>
                </div>
                <div className="vsStatCard-label">Файлов Excel вместо системы</div>
                <div className="vsStatCard-sub">Всё в одном месте</div>
              </article>
            </div>
          </div>
        </section>

        <section className="vsCta vsCta--light vsAnchor vsAnim" id="cta" aria-labelledby="cta-title">
          <div className="vsContainer vsCta-inner">
            <h2 className="vsCta-title" id="cta-title">
              Готовы отказаться от <span className="vsCta-accent">Excel</span>?
            </h2>
            <p className="vsCta-desc">
              Присоединяйтесь к платформе и управляйте корпоративным обучением прозрачно, эффективно и без потерь.
            </p>
            <div className="vsCta-btns">
              <a href="#" className="vsCta-btn vsCta-btnPrimary">
                Попробовать платформу →
              </a>
              <a href="#" className="vsCta-btn vsCta-btnGhost">
                Связаться с командой
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="vsFooter vsAnchor" id="footer">
        <div className="vsContainer vsFooter-inner">
          <div className="vsFooter-brand">
            <a href="/" className="vsFooter-brandRow">
              <span className="vsBrand-mark" aria-hidden="true">
                <Logo className="logoIcon logoIcon--footer" />
              </span>
              <div className="vsFooter-brandName">Nexus</div>
            </a>
            <div className="vsFooter-brandText">
              Единая платформа для управления очным корпоративным обучением:
              заявки, договоры, бюджет, посещаемость и сертификаты.
            </div>
          </div>

          <div className="vsFooter-col">
            <div className="vsFooter-title">ПЛАТФОРМА</div>
            <a className="vsFooter-link" href="#functions">
              Каталог тренингов
            </a>
            <a className="vsFooter-link" href="#capabilities">
              Заявки
            </a>
            <a className="vsFooter-link" href="#functions">
              Договоры
            </a>
            <a className="vsFooter-link" href="#functions">
              Аналитика
            </a>
          </div>

          <div className="vsFooter-col">
            <div className="vsFooter-title">РОЛИ</div>
            <a className="vsFooter-link" href="#roles">
              HR-менеджер
            </a>
            <a className="vsFooter-link" href="#roles">
              Руководители
            </a>
            <a className="vsFooter-link" href="#roles">
              Сотрудники
            </a>
          </div>

          <div className="vsFooter-col">
            <div className="vsFooter-title">ПОДДЕРЖКА</div>
            <a className="vsFooter-link" href="#about">
              Онбординг
            </a>
            <a className="vsFooter-link" href="#about">
              Техподдержка
            </a>
            <a className="vsFooter-link" href="#about">
              Методическая помощь
            </a>
          </div>
        </div>

        <div className="vsContainer">
          <div className="vsFooter-divider" aria-hidden="true" />
          <div className="vsFooter-bottom">© 2026 Nexus</div>
        </div>
      </footer>
    </div>
  );
}
