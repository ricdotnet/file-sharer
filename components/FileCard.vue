<template>
  <div ref="fileCardRef" class="file" :style="{ '--x': `${x}px`, '--y': `${y}px` }">
    <div class="card-title">
      {{ file.original_filename }}
    </div>
    <div class="icon-group">
      <CircleStackIcon class="icon" />
      <span>{{ convertSize(file.size) }}</span>
    </div>
    <div class="icon-group">
      <CalendarDaysIcon class="icon" />
      {{ formatShort(new Date(file.created)) }}
    </div>
    <div class="card-actions">
      <a target="_blank" :href="`/api/download/${file.filename}`">
        <ArrowDownOnSquareIcon class="icon" />
      </a>
      <IconButton @click="(e) => onClickLock(e, file.id)">
        <LockClosedIcon v-if="file.is_private" class="icon" />
        <LockOpenIcon v-else class="icon" />
      </IconButton>
      <IconButton v-if="file.canDelete" @click="(e) => onClickDelete(e, file.id)">
        <TrashIcon class="icon" />
      </IconButton>
      <IconButton @click="copyLinkToClipboard">
        <ClipboardDocumentCheckIcon class="icon" />
      </IconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { File } from '~/types';
import { useDate } from '~/composables/useDate';
import {
  ArrowDownOnSquareIcon,
  CircleStackIcon,
  CalendarDaysIcon,
  TrashIcon,
  LockClosedIcon,
  LockOpenIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/vue/16/solid';
import { useFileStore } from '~/stores/useFileStore';

const config = useRuntimeConfig();

const { removeFile, updatePrivacy } = useFileStore();

const fileCardRef = ref<HTMLAnchorElement | null>(null);
const { formatShort } = useDate();
const x = ref(0);
const y = ref(0);

const props = defineProps<{
  file: File;
}>();

onMounted(() => {
  if (!fileCardRef.value) return;

  document.addEventListener('mousemove', (event: MouseEvent) => {
    x.value = event.x - (fileCardRef.value?.offsetLeft ?? 0);
    y.value = event.y - (fileCardRef.value?.offsetTop ?? 0);
  });
});

// TODO: maybe move this to a composable
function convertSize(size: number) {
  let _size: number;
  let _unit: 'b' | 'KB' | 'MB';

  if (size < 1000) {
    _size = size;
    _unit = 'b';
  } else if (size < 1000000) {
    _size = size / 1000;
    _unit = 'KB';
  } else {
    _size = size / 1000000;
    _unit = 'MB';
  }

  return `${_size.toFixed(2)} ${_unit}`;
}

async function onClickDelete(event: MouseEvent, id: number) {
  event.stopPropagation();

  const confirmDelete = confirm('Are you sure you want to delete this file?');
  if (!confirmDelete) return;

  await useFetch(`/api/files/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `${localStorage.getItem('token')}`,
    },
  });

  removeFile(id);
}

async function onClickLock(event: MouseEvent, id: number) {
  event.stopPropagation();

  const confirmLock = confirm(`Are you sure you want to ${props.file.is_private ? 'unlock' : 'lock'} this file?`);
  if (!confirmLock) return;

  await useFetch(`/api/files/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      is_private: !props.file.is_private,
    }),
  });

  updatePrivacy(id);
}

function copyLinkToClipboard() {
  try {
    navigator.clipboard.writeText(`${config.public.appUrl}/api/download/${props.file.filename}`);
  } catch (err) {
    console.log(err);
  }
}
</script>

<style scoped>
.file {
  padding: 2rem 2.5rem;
  border: 1px solid var(--gun-metal);
  border-radius: 1.1rem;
  box-shadow: 0.2rem 0.2rem 0.5rem rgba(0, 0, 0, .5);
  position: relative;
  overflow: hidden;

  /* width: 200px; */
  height: 200px;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  transition: ease-in-out 200ms;

  * {
    color: white;
  }

  &:hover {
    border: 1px solid var(--air-blue);
  }

  &::before {
    content: "";
    background: radial-gradient(200px circle at var(--x) var(--y),
        rgba(58, 236, 248, 0.3) 0,
        rgba(82, 149, 220, 0.2) 30%,
        rgba(0, 212, 255, 0.1) 50%,
        transparent 100%);
    inset: -1px;
    position: absolute;
    z-index: -1;
  }
}

.card-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.card-actions {
  position: absolute;
  bottom: 2rem;
  display: flex;
  gap: 0.5rem;
}

.icon-group {
  display: flex;
  gap: 0.5rem;
}
</style>
