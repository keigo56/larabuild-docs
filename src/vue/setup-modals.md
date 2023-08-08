# Setup Modals

## Creating Modals
1. Create a new modal component inside <code>src/pages</code> directory. For this example we will create a new modal component named <code>AddUserModal</code>:
   ```vue
   <template>
     <BaseModal title="Add User" :is-open="isOpen" width="40rem">
       <div class="py-5">
         Modal Contents Here
       </div>
       <div class="mt-4 flex space-x-2">
         <button
             @click="closeModal"
             type="button"
             class="inline-flex justify-center rounded-md border border-transparent bg-brand-800 text-gray-100 dark:text-white px-4 py-2 text-sm font-medium dark:hover:bg-brand-700 hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
         >
           Close Modal
         </button>
       </div>
     </BaseModal>
   </template>
   
   <script setup>
   import BaseModal from "@/components/overlays/BaseModal.vue";
   import { ref } from "vue";
   
   const isOpen = ref(false);
   
   defineExpose({
     openModal,
     closeModal,
   });
   
   function openModal() {
     isOpen.value = true;
   }
   
   function closeModal() {
     isOpen.value = false;
   }
   
   </script>
   ```
   
## Using Modals
2. Open the page component where you wanted to add the modal component. In this example, we'll add <code>AddUserModal</code> modal to <code>UserIndexPage</code> component.
   ```vue
   <template>
     <BaseLayout>
       <div class="p-5">
         <h1 class="font-semibold text-2xl dark:text-white">Users Page</h1>
         <DataTable
             source-url="/api/datatable/users"
         >
           <template #actionItems>
             <button
                 @click="addUserModal.openModal()"
                 type="button"
                 class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
             >
               <PlusIcon class="w-4 h-4 mr-2 inline" />
               <span>Add User</span>
             </button>
           </template>
   
           <template v-slot:rowActionItems="props">
             <a
                 href="#"
                 class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
             >
               Edit
             </a>
           </template>
   
         </DataTable>
       </div>
     </BaseLayout>
     <AddUserModal ref="addUserModal"/>
   </template>
   
   <script setup>
   import { PlusIcon } from "@heroicons/vue/24/outline/index.js";
   import BaseLayout from "@/layouts/BaseLayout.vue";
   import DataTable from "@/modules/datatable/DataTable.vue";
   import AddUserModal from "@/pages/AddUserModal.vue";
   import {ref} from "vue";
   
   const addUserModal = ref(null);
   
   </script>
   ```
## Customizing Modals
We can customize the modal via BaseModal props. Consider the following example:
```vue{2}
<template>
  <BaseModal title="Add User" :is-open="isOpen" width="40rem">
    <div class="py-5">
      Modal Contents Here
    </div>
    <div class="mt-4 flex space-x-2">
      <button
          @click="closeModal"
          type="button"
          class="inline-flex justify-center rounded-md border border-transparent bg-brand-800 text-gray-100 dark:text-white px-4 py-2 text-sm font-medium dark:hover:bg-brand-700 hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        Close Modal
      </button>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from "@/components/overlays/BaseModal.vue";
import { ref } from "vue";

const isOpen = ref(false);

defineExpose({
  openModal,
  closeModal,
});

function openModal() {
  isOpen.value = true;
}

function closeModal() {
  isOpen.value = false;
}

</script>
```
On the highlighted code:
- <code>title</code>: Specifies the title displayed on the modal
- <code>is-open</code>: Specifies which variable controls the visibility of the modal. In the example the <code>isOpen</code> variable is used.
- <code>width</code>: Specifies width of the modal