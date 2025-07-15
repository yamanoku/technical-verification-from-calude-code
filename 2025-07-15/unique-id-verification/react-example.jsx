import React, { useId, useState, useCallback } from 'react';

// React 18+ でのユニークID生成の実装例

// 1. useIdフック - フォーム要素のアクセシビリティIDに最適
function FormWithUniqueId() {
  const nameId = useId();
  const emailId = useId();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <form>
      <div>
        <label htmlFor={nameId}>名前:</label>
        <input
          id={nameId}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor={emailId}>メール:</label>
        <input
          id={emailId}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
    </form>
  );
}

// 2. crypto.randomUUID() - 一般的な一意識別子生成
function ItemListWithUUID() {
  const [items, setItems] = useState([]);

  const addItem = useCallback(() => {
    const newItem = {
      id: crypto.randomUUID(), // ブラウザネイティブのUUID生成
      name: `Item ${items.length + 1}`,
      createdAt: new Date().toISOString()
    };
    setItems(prev => [...prev, newItem]);
  }, [items.length]);

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  return (
    <div>
      <button onClick={addItem}>アイテムを追加</button>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <span>{item.name}</span>
            <button onClick={() => removeItem(item.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 3. カスタムhook - 再利用可能なID生成ロジック
function useUniqueId(prefix = 'id') {
  const reactId = useId();
  const uuid = useCallback(() => crypto.randomUUID(), []);
  
  return {
    formId: `${prefix}-${reactId}`,
    generateUUID: uuid,
    prefixedId: useCallback((suffix) => `${prefix}-${reactId}-${suffix}`, [prefix, reactId])
  };
}

// カスタムhookの使用例
function ComponentWithCustomHook() {
  const { formId, generateUUID, prefixedId } = useUniqueId('user-form');
  const [data, setData] = useState([]);

  const addData = () => {
    const newData = {
      id: generateUUID(),
      formId: formId,
      fieldId: prefixedId('field-1'),
      value: Math.random()
    };
    setData(prev => [...prev, newData]);
  };

  return (
    <div>
      <h3>フォームID: {formId}</h3>
      <button onClick={addData}>データを追加</button>
      <ul>
        {data.map(item => (
          <li key={item.id}>
            <strong>ID:</strong> {item.id}<br />
            <strong>フィールドID:</strong> {item.fieldId}<br />
            <strong>値:</strong> {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

// 4. セッションベースのID管理
function useSessionId() {
  const [sessionId] = useState(() => {
    // セッションストレージから取得、なければ新規作成
    const stored = sessionStorage.getItem('sessionId');
    if (stored) return stored;
    
    const newId = crypto.randomUUID();
    sessionStorage.setItem('sessionId', newId);
    return newId;
  });

  return sessionId;
}

// メインアプリケーション
function App() {
  const sessionId = useSessionId();

  return (
    <div>
      <h1>React ユニークID生成の実装例</h1>
      <p>セッションID: {sessionId}</p>
      
      <section>
        <h2>1. useIdフック（フォーム要素）</h2>
        <FormWithUniqueId />
      </section>
      
      <section>
        <h2>2. crypto.randomUUID()（アイテム管理）</h2>
        <ItemListWithUUID />
      </section>
      
      <section>
        <h2>3. カスタムhook（再利用可能ロジック）</h2>
        <ComponentWithCustomHook />
      </section>
    </div>
  );
}

export default App;