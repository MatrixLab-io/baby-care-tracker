import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRightIcon,
  BellAlertIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ShareIcon,
  ShieldCheckIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import { getVaccineStatus, getPrivateVaccineStatus } from '../utils/vaccineEngine';
import { BD_EPI_SCHEDULE, STATUS_TONES } from '../config/vaccines';
import { PRIVATE_VACCINE_SCHEDULE } from '../config/privateVaccines';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DatePicker from '../components/DatePicker';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import CheckItem from '../components/ui/CheckItem';
import SectionHeader from '../components/ui/SectionHeader';

/** Today, so the hero opens on the schedule ahead of a newborn rather than a
    column of overdue stamps. Pick an older date and the overdue ones appear,
    which is the point of the tool. */
const defaultDob = () => new Date().toISOString().split('T')[0];

const TRACKS = [
  {
    icon: ShieldCheckIcon,
    title: 'Vaccines',
    body: 'Both schedules, with every due date worked out from the date of birth. Tick a dose the day it is given.',
  },
  {
    icon: BellAlertIcon,
    title: 'Outbreak alerts',
    body: 'Disease outbreaks reported in Bangladesh, matched against the doses your baby has not had yet.',
  },
  {
    icon: ChartBarIcon,
    title: 'Growth',
    body: 'Weight, height and head circumference over time, charted from the measurements you enter.',
  },
  {
    icon: TrophyIcon,
    title: 'Milestones',
    body: 'Age milestones fill in on their own. Add first smile, first step and the rest yourself.',
  },
  {
    icon: DocumentTextIcon,
    title: 'Documents',
    body: 'Birth certificates, prescriptions and reports, kept with the record instead of in a drawer.',
  },
  {
    icon: ShareIcon,
    title: 'A link to share',
    body: 'Send a read-only copy of the schedule to a doctor or a grandparent. No account needed to open it.',
  },
];

const PRIVACY = [
  'Your data is stored against your account, not shared between users',
  'It syncs to every device you sign in on',
  'We never share, sell, or advertise against it',
  'Delete everything, permanently, whenever you want',
];

const Landing = () => {
  const navigate = useNavigate();
  const [dob, setDob] = useState(defaultDob);

  // The hero is the product working: one date in, the real schedule out.
  const preview = useMemo(() => {
    if (!dob) return [];
    return [...getVaccineStatus(dob, {}), ...getPrivateVaccineStatus(dob, {})]
      .sort((a, b) => a.day - b.day)
      .slice(0, 6);
  }, [dob]);

  const signIn = () => navigate('/auth');

  return (
    <div className="min-h-screen flex flex-col bg-ground">
      <Header
        showPrivacy={false}
        showUser={false}
        showWhatsNew={false}
        rightContent={
          <Button size="sm" onClick={signIn}>
            Sign in
          </Button>
        }
      />

      <main className="flex-1">
        {/* Hero: the schedule, generated live */}
        <section className="page pt-10 pb-12 sm:pt-14 sm:pb-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 lg:items-start">
          <div className="flex flex-col gap-5 motion-rise">
            <h1 className="text-[34px] sm:text-[44px] font-bold leading-[1.08]">
              Every dose, on the day it is due.
            </h1>
            <p className="text-[17px] leading-relaxed text-ink-2 max-w-lg">
              MyBabyCare turns one date into your child&rsquo;s whole vaccination schedule — the Bangladesh
              EPI calendar, plus the private doses many clinics recommend alongside it.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="live">Free</Badge>
              <Badge tone="neutral">Works offline</Badge>
              <Badge tone="neutral">{BD_EPI_SCHEDULE.length + PRIVATE_VACCINE_SCHEDULE.length} doses tracked</Badge>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end gap-3 pt-1">
              <DatePicker
                label="Try it: your baby's date of birth"
                name="landing-dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                help="Try any date. Nothing here is saved."
                className="sm:w-64"
              />
              <Button size="lg" icon={ArrowRightIcon} onClick={signIn} className="sm:mb-6">
                Sign in to start
              </Button>
            </div>
          </div>

          <Card padding={false} className="overflow-hidden motion-rise motion-delay-2">
            <div className="flex items-baseline justify-between gap-3 px-4 py-3 border-b border-line bg-surface-2">
              <h2 className="text-sm font-semibold text-ink">First doses on this schedule</h2>
              <span className="text-xs text-ink-2">Due dates from the birth date</span>
            </div>

            {preview.length > 0 ? (
              <div className="row-divider">
                {preview.map((vaccine) => (
                  <div key={vaccine.key} className="flex items-start justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{vaccine.label}</p>
                      <p className="text-[13px] text-ink-2 mt-0.5">
                        {vaccine.dueDate}, at {vaccine.ageLabel.toLowerCase()}
                      </p>
                    </div>
                    <Badge tone={STATUS_TONES[vaccine.status]}>{vaccine.statusMessage}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-4 py-6 text-sm text-ink-2">Pick a date of birth to see the schedule.</p>
            )}

            <p className="px-4 py-3 border-t border-line text-[13px] text-ink-2">
              The full record continues to {PRIVATE_VACCINE_SCHEDULE.length + BD_EPI_SCHEDULE.length} doses,
              through to the teenage boosters.
            </p>
          </Card>
        </section>

        {/* The two schedules */}
        <section className="page section border-t border-line">
          <SectionHeader
            eyebrow="What it covers"
            title="Two schedules, one record"
            lead="Bangladesh runs a free national programme. Most private clinics add to it. MyBabyCare keeps both in the same list so nothing falls between them."
          />

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[17px] font-semibold text-ink">Bangladesh EPI</h3>
                <Badge tone="soon">{BD_EPI_SCHEDULE.length} doses</Badge>
              </div>
              <p className="text-sm text-ink-2">
                The government&rsquo;s Expanded Programme on Immunization, given free at EPI centres.
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {BD_EPI_SCHEDULE.map((v) => (
                  <li key={v.key}>
                    <Badge tone="neutral">{v.shortLabel}</Badge>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[17px] font-semibold text-ink">Private schedule</h3>
                <Badge tone="accent">{PRIVATE_VACCINE_SCHEDULE.length} doses</Badge>
              </div>
              <p className="text-sm text-ink-2">
                The doses clinics commonly recommend on top, from rotavirus in the first weeks to HPV and Tdap
                later on.
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {PRIVATE_VACCINE_SCHEDULE.slice(0, 10).map((v) => (
                  <li key={v.key}>
                    <Badge tone="neutral">{v.shortLabel}</Badge>
                  </li>
                ))}
                <li>
                  <Badge tone="neutral">+{PRIVATE_VACCINE_SCHEDULE.length - 10} more</Badge>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* What you track */}
        <section className="page section border-t border-line">
          <SectionHeader
            eyebrow="What you track"
            title="The whole record, not just the jabs"
            lead="Everything a parent ends up keeping on scraps of paper, in one place that survives a lost phone."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRACKS.map((item) => (
              <Card key={item.title} lift className="flex flex-col gap-3 group">
                <span className="icon-tile w-10 h-10 group-hover:bg-accent-soft group-hover:text-accent-soft-fg">
                  <item.icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <h3 className="text-[15px] font-semibold text-ink">{item.title}</h3>
                <p className="text-sm leading-relaxed text-ink-2">{item.body}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Privacy, then sign in */}
        <section className="page section border-t border-line grid gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
          <div className="flex flex-col gap-5">
            <SectionHeader
              eyebrow="Your data"
              title="A health record, handled like one"
              className="mb-0"
            />
            <div className="flex flex-col gap-2.5">
              {PRIVACY.map((line) => (
                <CheckItem key={line}>{line}</CheckItem>
              ))}
            </div>
          </div>

          <Card inverse className="flex flex-col gap-4 p-6 sm:p-8">
            <h2 className="text-2xl font-bold">Start your child&rsquo;s record</h2>
            <p className="text-[15px] leading-relaxed text-ink-inverse-2">
              Sign in with Google or an emailed link. Add a name and a date of birth, and the schedule is
              ready before you put the phone down.
            </p>
            <div className="pt-1">
              <Button variant="on-inverse" size="lg" onClick={signIn}>
                Sign in
              </Button>
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
