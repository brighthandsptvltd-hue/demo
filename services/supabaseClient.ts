// MOCK SUPABASE CLIENT WITH LOCALSTORAGE DATABASE
// This mock client implements the same API structure as @supabase/supabase-js
// allowing HopeCycle to run fully client-side.

// Define default initial mock data
const INITIAL_DATABASE = {
  users: [
    { id: 'donor-uuid-12345', email: 'donor@hopecycle.org', password: 'password' },
    { id: 'ngo-uuid-12345', email: 'ngo@hopecycle.org', password: 'password' },
    { id: 'admin-uuid-12345', email: 'admin@hopecycle.org', password: 'password' }
  ],
  profiles: [
    {
      id: 'donor-uuid-12345',
      full_name: 'Abhishek Sharma',
      organization_name: null,
      role: 'DONOR',
      location: 'New Delhi, India',
      latitude: 28.6139,
      longitude: 77.2090,
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=donor',
      verification_status: 'APPROVED',
      payment_status: 'PAID',
      created_at: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'ngo-uuid-12345',
      full_name: 'Abhishek NGO Representative',
      organization_name: 'Brighthands Foundation',
      representative_name: 'Abhishek NGO Representative',
      phone_number: '+91 98765 43210',
      certificate_number: 'NGO-DELHI-2026',
      certificate_url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=200',
      role: 'NGO',
      location: 'New Delhi, India',
      latitude: 28.6139,
      longitude: 77.2090,
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ngo',
      verification_status: 'VERIFIED',
      payment_status: 'PAID',
      created_at: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'admin-uuid-12345',
      full_name: 'System Admin',
      organization_name: null,
      role: 'ADMIN',
      location: 'System Controls',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      verification_status: 'APPROVED',
      payment_status: 'PAID',
      created_at: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  donations: [
    {
      id: 'donation-1',
      donor_id: 'donor-uuid-12345',
      title: 'Ergonomic Office Chairs',
      description: 'We have 5 high-quality ergonomic office chairs in excellent condition. Perfect for a community center, classroom, or NGO back-office.',
      category: 'Furniture',
      condition: 'Like New',
      location: 'New Delhi, India',
      latitude: 28.6139,
      longitude: 77.2090,
      image_urls: ['https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?q=80&w=600&auto=format&fit=crop'],
      status: 'ACTIVE',
      ngo_id: null,
      pickup_time: '10:00 AM - 12:00 PM',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'donation-2',
      donor_id: 'donor-uuid-12345',
      title: 'Warm Winter Coats & Blankets',
      description: 'Assorted warm jackets and wool blankets suitable for shelter residents. All items washed and sorted by size.',
      category: 'Clothing',
      condition: 'Good',
      location: 'New Delhi, India',
      latitude: 28.6139,
      longitude: 77.2090,
      image_urls: ['https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop'],
      status: 'ACTIVE',
      ngo_id: null,
      pickup_time: '02:00 PM - 04:00 PM',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'donation-3',
      donor_id: 'donor-uuid-12345',
      title: 'Primary School Textbooks',
      description: 'Science, Math, and English storybooks for Grade 1 to 5 children. Clean and complete sets.',
      category: 'Books',
      condition: 'Good',
      location: 'New Delhi, India',
      latitude: 28.6139,
      longitude: 77.2090,
      image_urls: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop'],
      status: 'ACTIVE',
      ngo_id: null,
      pickup_time: '04:00 PM - 06:00 PM',
      created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  ngo_requests: [
    {
      id: 'request-1',
      ngo_id: 'ngo-uuid-12345',
      title: 'Desks and Benches for Classroom',
      description: 'We are expanding our school room for underprivileged kids and urgently need study desks and benches.',
      priority: 'URGENT',
      category: 'Furniture',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'request-2',
      ngo_id: 'ngo-uuid-12345',
      title: 'Winter jackets for night shelters',
      description: 'Cold nights are setting in. We need adult warm clothing and jackets for our shelter residents.',
      priority: 'NORMAL',
      category: 'Clothing',
      created_at: new Date(Date.now() - 3600000 * 4).toISOString()
    }
  ],
  donation_interests: [
    {
      id: 'interest-1',
      donation_id: 'donation-1',
      ngo_id: 'ngo-uuid-12345',
      status: 'PENDING',
      created_at: new Date(Date.now() - 3600000 * 3).toISOString()
    }
  ],
  messages: [
    {
      id: 'msg-1',
      donation_id: 'donation-1',
      sender_id: 'donor-uuid-12345',
      receiver_id: 'ngo-uuid-12345',
      content: 'Hi! I saw your request for furniture. I have ergonomic chairs available, let me know if those would help.',
      is_read: true,
      created_at: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      id: 'msg-2',
      donation_id: 'donation-1',
      sender_id: 'ngo-uuid-12345',
      receiver_id: 'donor-uuid-12345',
      content: 'Hello! Yes, those ergonomic office chairs would be absolutely wonderful for our new center study room.',
      is_read: true,
      created_at: new Date(Date.now() - 3600000 * 4.5).toISOString()
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      user_id: 'donor-uuid-12345',
      title: 'New NGO Request Nearby!',
      description: 'Brighthands Foundation posted a request for study desks near you.',
      is_read: false,
      type: 'request',
      link: 'donor-requests',
      created_at: new Date(Date.now() - 3600000 * 1).toISOString()
    },
    {
      id: 'notif-2',
      user_id: 'ngo-uuid-12345',
      title: 'New Donation Listed',
      description: 'A donor listed Ergonomic Office Chairs in Delhi.',
      is_read: false,
      type: 'donation',
      link: 'ngo-dashboard',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ]
};

// Database utility helpers
function getLocalDb(): any {
  const dbStr = localStorage.getItem('hopeCycle_local_db');
  if (!dbStr) {
    localStorage.setItem('hopeCycle_local_db', JSON.stringify(INITIAL_DATABASE));
    return JSON.parse(JSON.stringify(INITIAL_DATABASE));
  }
  try {
    return JSON.parse(dbStr);
  } catch (e) {
    localStorage.setItem('hopeCycle_local_db', JSON.stringify(INITIAL_DATABASE));
    return JSON.parse(JSON.stringify(INITIAL_DATABASE));
  }
}

function saveLocalDb(db: any) {
  localStorage.setItem('hopeCycle_local_db', JSON.stringify(db));
}

function getLoggedInUser(): any {
  const sessionStr = localStorage.getItem('hopeCycle_session');
  if (!sessionStr) return null;
  try {
    const session = JSON.parse(sessionStr);
    return session?.user || null;
  } catch (e) {
    return null;
  }
}

// Realtime notification listeners
const listeners: Array<{
  channel: string;
  table: string;
  event: string;
  callback: (payload: any) => void;
}> = [];

function notifyTableChange(table: string, eventType: 'INSERT' | 'UPDATE' | 'DELETE', records: any[]) {
  setTimeout(() => {
    for (const record of records) {
      const payload = {
        schema: 'public',
        table,
        commit_timestamp: new Date().toISOString(),
        eventType,
        new: eventType === 'DELETE' ? {} : record,
        old: eventType === 'INSERT' ? {} : record,
        errors: null
      };

      for (const listener of listeners) {
        if (listener.table === table) {
          if (listener.event === '*' || listener.event === eventType) {
            try {
              listener.callback(payload);
            } catch (err) {
              console.error('Error in realtime subscription callback:', err);
            }
          }
        }
      }
    }
  }, 0);
}

// Auth state change listeners
const authChangeListeners: Array<(event: string, session: any) => void> = [];

function notifyAuthChange(event: string, session: any) {
  setTimeout(() => {
    for (const listener of authChangeListeners) {
      try {
        listener(event, session);
      } catch (err) {
        console.error('Error in auth state change listener:', err);
      }
    }
  }, 0);
}

// Resolve relationship joins (mock SQL JOIN queries)
function resolveRelations(tableName: string, records: any[]): any[] {
  const db = getLocalDb();
  const profiles = db.profiles || [];
  const donations = db.donations || [];

  return records.map(item => {
    const cloned = { ...item };

    if (tableName === 'donations') {
      const donor = profiles.find((p: any) => p.id === cloned.donor_id);
      cloned.profiles = donor || null;
      cloned.donor_profile = donor ? { full_name: donor.full_name } : null;

      if (cloned.ngo_id) {
        const ngo = profiles.find((p: any) => p.id === cloned.ngo_id);
        cloned.ngo = ngo || null;
        cloned.ngo_profile = ngo ? { organization_name: ngo.organization_name } : null;
      } else {
        cloned.ngo = null;
        cloned.ngo_profile = null;
      }

      // Keep image_url (singular) and image_urls (plural) in sync
      if (!cloned.image_url && cloned.image_urls && cloned.image_urls.length > 0) {
        cloned.image_url = cloned.image_urls[0];
      } else if (cloned.image_url && (!cloned.image_urls || cloned.image_urls.length === 0)) {
        cloned.image_urls = [cloned.image_url];
      }
    }

    if (tableName === 'ngo_requests') {
      const ngo = profiles.find((p: any) => p.id === cloned.ngo_id);
      cloned.profiles = ngo || null;
    }

    if (tableName === 'donation_interests') {
      const ngo = profiles.find((p: any) => p.id === cloned.ngo_id);
      cloned.profiles = ngo || null;

      const donation = donations.find((d: any) => d.id === cloned.donation_id);
      if (donation) {
        cloned.donations = resolveRelations('donations', [donation])[0];
      } else {
        cloned.donations = null;
      }
    }

    return cloned;
  });
}

// Helper to split OR parameters
function matchOrFilter(item: any, filterStr: string): boolean {
  const clauses: string[] = [];
  let depth = 0;
  let current = '';
  for (let i = 0; i < filterStr.length; i++) {
    const char = filterStr[i];
    if (char === '(') {
      depth++;
      current += char;
    } else if (char === ')') {
      depth--;
      current += char;
    } else if (char === ',' && depth === 0) {
      clauses.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (current) {
    clauses.push(current);
  }

  return clauses.some(clause => {
    clause = clause.trim();
    if (clause.startsWith('and(') && clause.endsWith(')')) {
      const inner = clause.substring(4, clause.length - 1);
      const parts = splitCommas(inner);
      return parts.every(part => evaluateCondition(item, part));
    } else if (clause.startsWith('or(') && clause.endsWith(')')) {
      const inner = clause.substring(3, clause.length - 1);
      const parts = splitCommas(inner);
      return parts.some(part => evaluateCondition(item, part));
    } else {
      return evaluateCondition(item, clause);
    }
  });
}

function splitCommas(str: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '(') depth++;
    else if (char === ')') depth--;

    if (char === ',' && depth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (current) parts.push(current);
  return parts;
}

function evaluateCondition(item: any, conditionStr: string): boolean {
  conditionStr = conditionStr.trim();
  const eqMatch = conditionStr.match(/^([^.]+)\.eq\.(.+)$/);
  if (eqMatch) {
    const [, col, val] = eqMatch;
    const cleanVal = val.replace(/^["']|["']$/g, '');
    return String(item[col]) === String(cleanVal);
  }
  const isMatch = conditionStr.match(/^([^.]+)\.is\.(.+)$/);
  if (isMatch) {
    const [, col, val] = isMatch;
    if (val === 'null') return item[col] === null || item[col] === undefined;
    if (val === 'true') return item[col] === true;
    if (val === 'false') return item[col] === false;
    return String(item[col]) === val;
  }
  const inMatch = conditionStr.match(/^([^.]+)\.in\.\((.+)\)$/);
  if (inMatch) {
    const [, col, valStr] = inMatch;
    const values = valStr.split(',').map(v => v.replace(/^["']|["']$/g, '').trim());
    return values.includes(String(item[col]));
  }
  return false;
}

// Mock Query Builder
class MockQueryBuilder {
  private tableName: string;
  private filters: Array<(item: any) => boolean> = [];
  private orderCol: string | null = null;
  private orderAscending: boolean = true;
  private limitCount: number | null = null;
  private singleResult: boolean = false;
  private maybeSingleResult: boolean = false;
  private selectCountOnly: boolean = false;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(columns: string = '*', options?: { count?: 'exact' | 'planned' | 'estimated', head?: boolean }) {
    if (options?.head || options?.count) {
      this.selectCountOnly = true;
    }
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push((item) => {
      return item[column] === value;
    });
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push((item) => {
      return item[column] !== value;
    });
    return this;
  }

  in(column: string, values: any[]) {
    this.filters.push((item) => {
      return values.includes(item[column]);
    });
    return this;
  }

  or(filterString: string) {
    this.filters.push((item) => {
      return matchOrFilter(item, filterString);
    });
    return this;
  }

  cs(column: string, value: any) {
    this.filters.push((item) => {
      const arr = item[column];
      if (Array.isArray(arr)) {
        if (Array.isArray(value)) {
          return value.every(v => arr.includes(v));
        }
        return arr.includes(value);
      }
      return false;
    });
    return this;
  }

  order(column: string, { ascending = true } = {}) {
    this.orderCol = column;
    this.orderAscending = ascending;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.singleResult = true;
    return this;
  }

  maybeSingle() {
    this.maybeSingleResult = true;
    return this;
  }

  async then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    try {
      const res = await this.execute();
      if (onfulfilled) return onfulfilled(res);
      return res;
    } catch (err) {
      if (onrejected) return onrejected(err);
      throw err;
    }
  }

  private async execute() {
    const db = getLocalDb();
    const rawData = db[this.tableName] || [];

    // Filter
    let filtered = rawData.filter(item => {
      return this.filters.every(filter => filter(item));
    });

    // Resolve Relationships
    filtered = resolveRelations(this.tableName, filtered);

    // Sort
    if (this.orderCol) {
      filtered.sort((a, b) => {
        const valA = a[this.orderCol!];
        const valB = b[this.orderCol!];
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;
        if (valA < valB) return this.orderAscending ? -1 : 1;
        if (valA > valB) return this.orderAscending ? 1 : -1;
        return 0;
      });
    }

    // Limit
    if (this.limitCount !== null) {
      filtered = filtered.slice(0, this.limitCount);
    }

    if (this.selectCountOnly) {
      return { data: null, count: filtered.length, error: null };
    }

    if (this.singleResult) {
      if (filtered.length === 0) {
        return { data: null, error: { message: 'No rows found' } };
      }
      return { data: filtered[0], error: null };
    }

    if (this.maybeSingleResult) {
      return { data: filtered[0] || null, error: null };
    }

    return { data: filtered, error: null };
  }

  async insert(recordOrRecords: any) {
    const db = getLocalDb();
    if (!db[this.tableName]) {
      db[this.tableName] = [];
    }

    const records = Array.isArray(recordOrRecords) ? recordOrRecords : [recordOrRecords];
    const newRecords = records.map(r => {
      const newRec = {
        id: r.id || crypto.randomUUID(),
        created_at: r.created_at || new Date().toISOString(),
        updated_at: r.updated_at || new Date().toISOString(),
        ...r
      };
      db[this.tableName].push(newRec);
      return newRec;
    });

    saveLocalDb(db);
    notifyTableChange(this.tableName, 'INSERT', newRecords);

    const result = {
      data: Array.isArray(recordOrRecords) ? newRecords : newRecords[0],
      error: null,
      select: () => ({
        then: (resolve: any) => resolve(result)
      })
    };
    return result;
  }

  async update(updates: any) {
    const db = getLocalDb();
    const tableData = db[this.tableName] || [];

    let updatedCount = 0;
    const updatedRecords: any[] = [];

    const newTableData = tableData.map(item => {
      if (this.filters.every(filter => filter(item))) {
        const updatedItem = {
          ...item,
          ...updates,
          updated_at: new Date().toISOString()
        };
        updatedCount++;
        updatedRecords.push(updatedItem);
        return updatedItem;
      }
      return item;
    });

    db[this.tableName] = newTableData;
    saveLocalDb(db);

    if (updatedCount > 0) {
      notifyTableChange(this.tableName, 'UPDATE', updatedRecords);
    }

    return { data: updatedRecords, error: null };
  }

  async delete() {
    const db = getLocalDb();
    const tableData = db[this.tableName] || [];

    const deletedRecords: any[] = [];
    const newTableData = tableData.filter(item => {
      const match = this.filters.every(filter => filter(item));
      if (match) {
        deletedRecords.push(item);
      }
      return !match;
    });

    db[this.tableName] = newTableData;
    saveLocalDb(db);

    if (deletedRecords.length > 0) {
      notifyTableChange(this.tableName, 'DELETE', deletedRecords);
    }

    return { data: deletedRecords, error: null };
  }
}

// Mock Realtime Channel
class MockChannel {
  name: string;
  private onHandlers: Array<{ event: string; filter: any; callback: (payload: any) => void }> = [];

  constructor(name: string) {
    this.name = name;
  }

  on(event: string, filter: any, callback: (payload: any) => void) {
    this.onHandlers.push({ event, filter, callback });
    return this;
  }

  subscribe(callback?: (status: string) => void) {
    for (const h of this.onHandlers) {
      listeners.push({
        channel: this.name,
        table: h.filter.table,
        event: h.filter.event || '*',
        callback: h.callback
      });
    }
    if (callback) {
      setTimeout(() => callback('SUBSCRIBED'), 0);
    }
    return this;
  }

  unsubscribe() {
    for (let i = listeners.length - 1; i >= 0; i--) {
      if (listeners[i].channel === this.name) {
        listeners.splice(i, 1);
      }
    }
  }
}

// Mock Storage Bucket
class MockStorageBucket {
  private bucketName: string;

  constructor(bucketName: string) {
    this.bucketName = bucketName;
  }

  async upload(filePath: string, file: File | Blob) {
    // Convert File to Object URL so it displays instantly in the browser local session
    let objectUrl = '';
    if (file instanceof File || file instanceof Blob) {
      objectUrl = URL.createObjectURL(file);
    } else {
      objectUrl = 'https://images.unsplash.com/photo-1582213726839-ed310fe6b76f?q=80&w=200';
    }

    // Save the object URL in the mock storage database
    const db = getLocalDb();
    if (!db.storage) db.storage = {};
    if (!db.storage[this.bucketName]) db.storage[this.bucketName] = {};
    db.storage[this.bucketName][filePath] = objectUrl;
    saveLocalDb(db);

    return { data: { path: filePath }, error: null };
  }

  getPublicUrl(filePath: string) {
    const db = getLocalDb();
    const bucket = db.storage?.[this.bucketName] || {};
    const url = bucket[filePath] || 'https://images.unsplash.com/photo-1582213726839-ed310fe6b76f?q=80&w=200';
    return { data: { publicUrl: url } };
  }
}

// Main Supabase client mock instance
export const supabase: any = {
  auth: {
    getUser: async () => {
      const user = getLoggedInUser();
      return { data: { user }, error: null };
    },

    getSession: async () => {
      const sessionStr = localStorage.getItem('hopeCycle_session');
      if (sessionStr) {
        try {
          return { data: { session: JSON.parse(sessionStr) }, error: null };
        } catch (e) {
          return { data: { session: null }, error: null };
        }
      }
      return { data: { session: null }, error: null };
    },

    signInWithPassword: async ({ email, password }: any) => {
      const db = getLocalDb();
      const users = db.users || [];
      const user = users.find((u: any) => u.email === email);
      if (!user || user.password !== password) {
        return { data: { user: null }, error: { message: 'Invalid login credentials' } };
      }

      const profile = (db.profiles || []).find((p: any) => p.id === user.id);
      const session = {
        access_token: 'mock-token-' + user.id,
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-' + user.id,
        user: {
          id: user.id,
          email: user.email,
          user_metadata: {
            full_name: profile?.full_name || '',
            role: profile?.role || 'DONOR',
            organization_name: profile?.organization_name || null,
            location: profile?.location || '',
            latitude: profile?.latitude || null,
            longitude: profile?.longitude || null
          }
        }
      };

      localStorage.setItem('hopeCycle_session', JSON.stringify(session));
      notifyAuthChange('SIGNED_IN', session);

      return { data: { user: session.user, session }, error: null };
    },

    signUp: async ({ email, password, options }: any) => {
      const db = getLocalDb();
      const users = db.users || [];

      if (users.some((u: any) => u.email === email)) {
        return { data: { user: null }, error: { message: 'User already exists' } };
      }

      const userId = crypto.randomUUID();
      const newUser = { id: userId, email, password };
      users.push(newUser);
      db.users = users;

      const profileData = options?.data || {};
      const newProfile = {
        id: userId,
        full_name: profileData.full_name || '',
        organization_name: profileData.organization_name || null,
        role: (profileData.role || 'DONOR').toUpperCase(),
        location: profileData.location || '',
        latitude: profileData.latitude || null,
        longitude: profileData.longitude || null,
        verification_status: profileData.role === 'NGO' ? 'UNVERIFIED' : 'APPROVED',
        payment_status: profileData.role === 'NGO' ? 'UNPAID' : 'PAID',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const profiles = db.profiles || [];
      profiles.push(newProfile);
      db.profiles = profiles;

      saveLocalDb(db);

      const session = {
        access_token: 'mock-token-' + userId,
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-' + userId,
        user: {
          id: userId,
          email,
          user_metadata: {
            full_name: newProfile.full_name,
            role: newProfile.role,
            organization_name: newProfile.organization_name,
            location: newProfile.location,
            latitude: newProfile.latitude,
            longitude: newProfile.longitude
          }
        }
      };

      localStorage.setItem('hopeCycle_session', JSON.stringify(session));
      notifyAuthChange('SIGNED_IN', session);

      return { data: { user: session.user, session }, error: null };
    },

    signOut: async () => {
      localStorage.removeItem('hopeCycle_session');
      notifyAuthChange('SIGNED_OUT', null);
      return { error: null };
    },

    onAuthStateChange: (callback: any) => {
      authChangeListeners.push(callback);

      const sessionStr = localStorage.getItem('hopeCycle_session');
      let session = null;
      if (sessionStr) {
        try {
          session = JSON.parse(sessionStr);
        } catch (e) {}
      }

      const event = session ? 'INITIAL_SESSION' : 'SIGNED_OUT';
      setTimeout(() => {
        callback(event, session);
      }, 0);

      return {
        data: {
          subscription: {
            unsubscribe: () => {
              const index = authChangeListeners.indexOf(callback);
              if (index !== -1) {
                authChangeListeners.splice(index, 1);
              }
            }
          }
        }
      };
    }
  },

  from: (tableName: string) => {
    return new MockQueryBuilder(tableName);
  },

  channel: (channelName: string) => {
    return new MockChannel(channelName);
  },

  removeChannel: (channel: MockChannel) => {
    if (channel && typeof channel.unsubscribe === 'function') {
      channel.unsubscribe();
    }
  },

  storage: {
    from: (bucketName: string) => {
      return new MockStorageBucket(bucketName);
    }
  },

  // Mock Database RPC calls
  rpc: async (functionName: string, args: any = {}) => {
    const user = getLoggedInUser();
    if (!user) return { data: [], error: { message: 'Authentication required' } };

    const db = getLocalDb();

    if (functionName === 'get_donor_requests') {
      const interests = db.donation_interests || [];
      const donations = db.donations || [];
      const profiles = db.profiles || [];

      const result = [];
      for (const di of interests) {
        if (di.status !== 'PENDING') continue;
        const donation = donations.find((d: any) => d.id === di.donation_id);
        if (!donation || donation.donor_id !== user.id) continue;
        const ngo = profiles.find((p: any) => p.id === di.ngo_id);
        if (!ngo) continue;

        result.push({
          interest_id: di.id,
          status: di.status,
          created_at: di.created_at,
          donation_id: donation.id,
          donation_title: donation.title,
          ngo_id: ngo.id,
          ngo_name: ngo.organization_name || ngo.full_name
        });
      }
      return { data: result, error: null };
    }

    if (functionName === 'get_conversations') {
      const messages = db.messages || [];
      const donations = db.donations || [];
      const profiles = db.profiles || [];

      const partnerIds = new Set<string>();

      // 1. Partners from messages
      for (const msg of messages) {
        if (msg.sender_id === user.id) {
          partnerIds.add(msg.receiver_id);
        } else if (msg.receiver_id === user.id) {
          partnerIds.add(msg.sender_id);
        }
      }

      // 2. Partners from assigned donations (NGOs linked to me)
      for (const d of donations) {
        if (d.donor_id === user.id && d.ngo_id && ['PENDING', 'COMPLETED'].includes(d.status)) {
          partnerIds.add(d.ngo_id);
        }
      }

      const result = [];
      for (const partnerId of partnerIds) {
        const profile = profiles.find((p: any) => p.id === partnerId);
        if (!profile) continue;

        const conversationMessages = messages.filter((m: any) =>
          (m.sender_id === user.id && m.receiver_id === partnerId) ||
          (m.sender_id === partnerId && m.receiver_id === user.id)
        );

        conversationMessages.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        const latestMsg = conversationMessages[0];
        const last_message = latestMsg ? latestMsg.content : 'Start a conversation';
        const last_message_time = latestMsg ? latestMsg.created_at : null;

        const unread_count = conversationMessages.filter((m: any) =>
          m.sender_id === partnerId && m.receiver_id === user.id && !m.is_read
        ).length;

        result.push({
          user_id: profile.id,
          full_name: profile.full_name,
          organization_name: profile.organization_name,
          role: profile.role,
          last_message,
          last_message_time,
          unread_count
        });
      }

      result.sort((a, b) => {
        if (!a.last_message_time) return 1;
        if (!b.last_message_time) return -1;
        return new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime();
      });

      return { data: result, error: null };
    }

    return { data: null, error: { message: `Function ${functionName} not found` } };
  }
};
