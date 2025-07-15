<template>
  <div>
    <h1>Vue.js ユニークID生成の実装例</h1>
    <p>セッションID: {{ sessionId }}</p>
    
    <section>
      <h2>1. Composition API - フォーム要素</h2>
      <form>
        <div>
          <label :for="nameId">名前:</label>
          <input
            :id="nameId"
            v-model="form.name"
            type="text"
          />
        </div>
        <div>
          <label :for="emailId">メール:</label>
          <input
            :id="emailId"
            v-model="form.email"
            type="email"
          />
        </div>
      </form>
    </section>
    
    <section>
      <h2>2. リアクティブなアイテム管理</h2>
      <button @click="addItem">アイテムを追加</button>
      <ul>
        <li v-for="item in items" :key="item.id">
          <span>{{ item.name }}</span>
          <button @click="removeItem(item.id)">削除</button>
        </li>
      </ul>
    </section>
    
    <section>
      <h2>3. カスタムComposable使用例</h2>
      <h3>フォームID: {{ customId.formId }}</h3>
      <button @click="addCustomData">データを追加</button>
      <ul>
        <li v-for="data in customData" :key="data.id">
          <strong>ID:</strong> {{ data.id }}<br />
          <strong>フィールドID:</strong> {{ data.fieldId }}<br />
          <strong>値:</strong> {{ data.value }}
        </li>
      </ul>
    </section>
    
    <section>
      <h2>4. 永続化ID管理</h2>
      <p>永続ID: {{ persistentId }}</p>
      <button @click="regeneratePersistentId">永続IDを再生成</button>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// 1. 基本的なユニークID生成
const generateId = (prefix = 'id') => {
  return `${prefix}-${crypto.randomUUID()}`
}

// 2. セッションベースのID管理
const sessionId = ref('')
onMounted(() => {
  const stored = sessionStorage.getItem('vue-sessionId')
  if (stored) {
    sessionId.value = stored
  } else {
    const newId = crypto.randomUUID()
    sessionStorage.setItem('vue-sessionId', newId)
    sessionId.value = newId
  }
})

// 3. フォーム要素のID生成
const nameId = generateId('name')
const emailId = generateId('email')
const form = reactive({
  name: '',
  email: ''
})

// 4. アイテム管理（リアクティブ）
const items = ref([])

const addItem = () => {
  const newItem = {
    id: crypto.randomUUID(),
    name: `Item ${items.value.length + 1}`,
    createdAt: new Date().toISOString()
  }
  items.value.push(newItem)
}

const removeItem = (id) => {
  const index = items.value.findIndex(item => item.id === id)
  if (index !== -1) {
    items.value.splice(index, 1)
  }
}

// 5. カスタムComposable - useUniqueId
const useUniqueId = (prefix = 'id') => {
  const baseId = crypto.randomUUID()
  
  return {
    formId: computed(() => `${prefix}-${baseId}`),
    generateUUID: () => crypto.randomUUID(),
    prefixedId: (suffix) => `${prefix}-${baseId}-${suffix}`
  }
}

// カスタムComposableの使用
const customId = useUniqueId('user-form')
const customData = ref([])

const addCustomData = () => {
  const newData = {
    id: customId.generateUUID(),
    formId: customId.formId.value,
    fieldId: customId.prefixedId('field-1'),
    value: Math.random()
  }
  customData.value.push(newData)
}

// 6. 永続化ID管理
const persistentId = ref('')

const loadPersistentId = () => {
  const stored = localStorage.getItem('vue-persistentId')
  if (stored) {
    persistentId.value = stored
  } else {
    const newId = crypto.randomUUID()
    localStorage.setItem('vue-persistentId', newId)
    persistentId.value = newId
  }
}

const regeneratePersistentId = () => {
  const newId = crypto.randomUUID()
  localStorage.setItem('vue-persistentId', newId)
  persistentId.value = newId
}

// 初期化
onMounted(() => {
  loadPersistentId()
})
</script>

<script>
// Vue.js 3+ でのユニークID生成の実装パターン

// 1. Options APIでの実装例
export default {
  name: 'VueUniqueIdExample',
  data() {
    return {
      optionsApiId: null,
      counter: 0
    }
  },
  created() {
    // Options APIでのID生成
    this.optionsApiId = this.generateUniqueId('options-api')
  },
  methods: {
    generateUniqueId(prefix = 'id') {
      return `${prefix}-${crypto.randomUUID()}`
    },
    
    // カウンターベースのID生成（単純な連番）
    generateCounterId(prefix = 'counter') {
      return `${prefix}-${++this.counter}`
    },
    
    // タイムスタンプベースのID生成
    generateTimestampId(prefix = 'timestamp') {
      return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
  }
}
</script>

<style scoped>
section {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

h2 {
  color: #42b883;
  margin-bottom: 10px;
}

label {
  display: inline-block;
  width: 80px;
  margin-right: 10px;
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
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #369970;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 5px 0;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 3px;
}
</style>