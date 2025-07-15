<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  // Svelte 4+ でのユニークID生成の実装例

  // 1. 基本的なユニークID生成
  const generateId = (prefix = 'id') => {
    return `${prefix}-${crypto.randomUUID()}`;
  };

  // 2. セッションベースのID管理
  let sessionId = '';
  onMount(() => {
    const stored = sessionStorage.getItem('svelte-sessionId');
    if (stored) {
      sessionId = stored;
    } else {
      const newId = crypto.randomUUID();
      sessionStorage.setItem('svelte-sessionId', newId);
      sessionId = newId;
    }
  });

  // 3. フォーム要素のID生成
  const nameId = generateId('name');
  const emailId = generateId('email');
  let form = {
    name: '',
    email: ''
  };

  // 4. リアクティブなアイテム管理
  let items = [];
  
  const addItem = () => {
    const newItem = {
      id: crypto.randomUUID(),
      name: `Item ${items.length + 1}`,
      createdAt: new Date().toISOString()
    };
    items = [...items, newItem];
  };

  const removeItem = (id) => {
    items = items.filter(item => item.id !== id);
  };

  // 5. Svelte Store を使用したID管理
  const createIdStore = () => {
    const { subscribe, set, update } = writable([]);
    
    return {
      subscribe,
      add: (prefix = 'store') => {
        const newId = {
          id: crypto.randomUUID(),
          prefix,
          fullId: `${prefix}-${crypto.randomUUID()}`,
          createdAt: new Date().toISOString()
        };
        update(ids => [...ids, newId]);
      },
      remove: (id) => {
        update(ids => ids.filter(item => item.id !== id));
      },
      clear: () => set([])
    };
  };

  const idStore = createIdStore();

  // 6. カスタムID生成関数
  const useUniqueId = (prefix = 'id') => {
    const baseId = crypto.randomUUID();
    
    return {
      formId: `${prefix}-${baseId}`,
      generateUUID: () => crypto.randomUUID(),
      prefixedId: (suffix) => `${prefix}-${baseId}-${suffix}`,
      timestampId: () => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  };

  // カスタムID関数の使用
  const customId = useUniqueId('user-form');
  let customData = [];

  const addCustomData = () => {
    const newData = {
      id: customId.generateUUID(),
      formId: customId.formId,
      fieldId: customId.prefixedId('field-1'),
      timestampId: customId.timestampId(),
      value: Math.random()
    };
    customData = [...customData, newData];
  };

  // 7. 永続化ID管理
  let persistentId = '';
  
  const loadPersistentId = () => {
    const stored = localStorage.getItem('svelte-persistentId');
    if (stored) {
      persistentId = stored;
    } else {
      const newId = crypto.randomUUID();
      localStorage.setItem('svelte-persistentId', newId);
      persistentId = newId;
    }
  };

  const regeneratePersistentId = () => {
    const newId = crypto.randomUUID();
    localStorage.setItem('svelte-persistentId', newId);
    persistentId = newId;
  };

  // 8. リアクティブなID生成（Svelte特有）
  $: dynamicId = `dynamic-${sessionId}-${items.length}`;

  // 初期化
  onMount(() => {
    loadPersistentId();
  });
</script>

<main>
  <h1>Svelte ユニークID生成の実装例</h1>
  <p>セッションID: {sessionId}</p>
  <p>動的ID: {dynamicId}</p>
  
  <section>
    <h2>1. 基本的なフォーム要素</h2>
    <form>
      <div>
        <label for={nameId}>名前:</label>
        <input
          id={nameId}
          type="text"
          bind:value={form.name}
        />
      </div>
      <div>
        <label for={emailId}>メール:</label>
        <input
          id={emailId}
          type="email"
          bind:value={form.email}
        />
      </div>
    </form>
  </section>
  
  <section>
    <h2>2. リアクティブなアイテム管理</h2>
    <button on:click={addItem}>アイテムを追加</button>
    <ul>
      {#each items as item (item.id)}
        <li>
          <span>{item.name}</span>
          <button on:click={() => removeItem(item.id)}>削除</button>
        </li>
      {/each}
    </ul>
  </section>
  
  <section>
    <h2>3. Svelte Store を使用したID管理</h2>
    <button on:click={() => idStore.add('store-item')}>Store IDを追加</button>
    <button on:click={() => idStore.clear()}>Store をクリア</button>
    <ul>
      {#each $idStore as storeItem (storeItem.id)}
        <li>
          <strong>ID:</strong> {storeItem.id}<br />
          <strong>フルID:</strong> {storeItem.fullId}<br />
          <strong>作成時刻:</strong> {storeItem.createdAt}
          <button on:click={() => idStore.remove(storeItem.id)}>削除</button>
        </li>
      {/each}
    </ul>
  </section>
  
  <section>
    <h2>4. カスタムID生成関数</h2>
    <h3>フォームID: {customId.formId}</h3>
    <button on:click={addCustomData}>カスタムデータを追加</button>
    <ul>
      {#each customData as data (data.id)}
        <li>
          <strong>ID:</strong> {data.id}<br />
          <strong>フィールドID:</strong> {data.fieldId}<br />
          <strong>タイムスタンプID:</strong> {data.timestampId}<br />
          <strong>値:</strong> {data.value}
        </li>
      {/each}
    </ul>
  </section>
  
  <section>
    <h2>5. 永続化ID管理</h2>
    <p>永続ID: {persistentId}</p>
    <button on:click={regeneratePersistentId}>永続IDを再生成</button>
  </section>
  
  <section>
    <h2>6. 条件付きレンダリングでのID管理</h2>
    {#if items.length > 0}
      <div id="item-container-{items.length}">
        <h3>アイテム数: {items.length}</h3>
        {#each items as item, index (item.id)}
          <div id="item-{item.id}">
            <span>#{index + 1}: {item.name}</span>
          </div>
        {/each}
      </div>
    {:else}
      <p>アイテムがありません</p>
    {/if}
  </section>
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  section {
    margin: 20px 0;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
  
  h1 {
    color: #ff3e00;
    text-align: center;
  }
  
  h2 {
    color: #ff3e00;
    margin-bottom: 10px;
  }
  
  label {
    display: inline-block;
    width: 80px;
    margin-right: 10px;
    font-weight: bold;
  }
  
  input {
    margin: 5px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }
  
  button {
    margin: 5px;
    padding: 8px 16px;
    background-color: #ff3e00;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  button:hover {
    background-color: #e63900;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    margin: 5px 0;
    padding: 8px;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 3px;
  }
  
  div[id^="item-"] {
    margin: 5px 0;
    padding: 5px;
    background-color: #e6f3ff;
    border-radius: 3px;
  }
  
  p {
    margin: 10px 0;
  }
  
  form div {
    margin: 10px 0;
  }
</style>