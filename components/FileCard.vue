<template>
  <div
    ref="fileCardRef"
    class="file"
    :style="{ '--x': `${x}px`, '--y': `${y}px` }"
  >
    <div class="card-title" :title="file.original_filename">
      {{ sliceTitle(file.original_filename) }}
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
      <span v-if="file.is_image || file.is_video">
        <a target="_blank" :href="`/view/${file.uuid}`">
          <PlayIcon class="icon" />
        </a>
      </span>
      <span v-else>
        <a target="_blank" :href="`/api/download/${file.filename}`">
          <ArrowDownOnSquareIcon class="icon" />
        </a>
      </span>
      <IconButton @click="(e: MouseEvent) => onClickLock(e, file.id)">
        <LockClosedIcon v-if="file.is_private" class="icon" />
        <LockOpenIcon v-else class="icon" />
      </IconButton>
      <IconButton
        v-if="file.canDelete"
        @click="(e: MouseEvent) => onClickDelete(e, file.id)"
      >
        <TrashIcon class="icon" />
      </IconButton>
      <IconButton @click="copyLinkToClipboard">
        <ClipboardDocumentCheckIcon class="icon" />
      </IconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IFile } from '~/types';
import {
  useCopyUrlToClipboard,
  useDate,
  useFileStore,
  useToaster,
  useUserStore,
} from '#imports';
import {
  ArrowDownOnSquareIcon,
  CalendarDaysIcon,
  CircleStackIcon,
  ClipboardDocumentCheckIcon,
  LockClosedIcon,
  LockOpenIcon,
  TrashIcon,
  PlayIcon,
} from '@heroicons/vue/16/solid';

const { authToken } = useUserStore();
const { removeFile, updatePrivacy } = useFileStore();
const { addToast } = useToaster();

const fileCardRef = ref<HTMLAnchorElement | null>(null);
const { formatShort } = useDate();
const x = ref(0);
const y = ref(0);

const props = defineProps<{
  file: IFile;
}>();

onMounted(() => {
  if (!fileCardRef.value) {
    return;
  }

  document.addEventListener('mousemove', (event: MouseEvent) => {
    x.value = event.pageX - (fileCardRef.value?.offsetLeft ?? 0);
    y.value = event.pageY - (fileCardRef.value?.offsetTop ?? 0);
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

function sliceTitle(title: string) {
  return title.length > 70 ? `${title.slice(0, 70)}...` : title;
}

async function onClickDelete(event: MouseEvent, id: number) {
  event.stopPropagation();

  const confirmDelete = confirm('Are you sure you want to delete this file?');
  if (!confirmDelete) {
    return;
  }

  try {
    await request({
      url: `/api/files/${id}`,
      method: 'DELETE',
      headers: { authorization: authToken! },
    });
  } catch (_) {
    addToast({
      type: 'error',
      message: 'Error while trying to delete the file',
    });

    return;
  }

  removeFile(id);

  addToast({
    message: 'Fie successfully deleted',
    type: 'success',
  });
}

async function onClickLock(event: MouseEvent, id: number) {
  event.stopPropagation();

  const confirmLock = confirm(
    `Are you sure you want to ${
      props.file.is_private ? 'unlock' : 'lock'
    } this file?`
  );
  if (!confirmLock) {
    return;
  }

  try {
    await request({
      url: `/api/files/${id}`,
      method: 'PATCH',
      headers: { Authorization: authToken! },
      data: { is_private: !props.file.is_private },
    });
  } catch (_) {
    addToast({
      type: 'error',
      message: 'Error while trying to lock or unlock the file',
    });

    return;
  }

  updatePrivacy(id);

  addToast({
    message: `The file has been ${
      props.file.is_private ? 'unlocked' : 'locked'
    }.`,
    type: 'info',
  });
}

async function copyLinkToClipboard() {
  try {
    await useCopyUrlToClipboard().copy(`/api/download/${props.file.filename}`);
    addToast({ message: 'File URL copied to clipboard.', type: 'info' });
  } catch (err) {
    console.log(err);
    addToast({
      message: 'Could not copy the file to clipboard.',
      type: 'error',
    });
  }
}
</script>

<style scoped>
.file {
  padding: 2rem 2.5rem;
  border: 1px solid var(--gun-metal);
  border-radius: 1.1rem;
  box-shadow: 0.2rem 0.2rem 0.5rem rgba(0, 0, 0, 0.5);
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
    content: '';
    background: radial-gradient(
      200px circle at var(--x) var(--y),
      rgba(58, 236, 248, 0.3) 0,
      rgba(82, 149, 220, 0.2) 30%,
      rgba(0, 212, 255, 0.1) 50%,
      transparent 100%
    );
    inset: -1px;
    position: absolute;
    z-index: -1;
  }
}

.card-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
  word-break: break-all;
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
