import { describe, expect, test } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadPage from '@/features/file-upload/upload-page';

describe('UploadPage', () => {

    function createFileListMock (mockFile: File) {
        return {
            0: mockFile,
            length: 1,
            item: (_: number) => mockFile,
            [Symbol.iterator]: function* () {
                yield mockFile;
              }
          } as FileList;
      };

    function createMockFile (name: string, content: string){
        return new File([content], name, {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
    }



  test('user can upload one file', async () => {
    render(<UploadPage />);

    // Create a mock Excel file
    const mockFile = createMockFile('test.xlsx', 'test content');
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;

    // Trigger file upload
    fireEvent.change(fileInput, { target: { files: createFileListMock(mockFile) } });

    // Verify file appears in the UI
    await waitFor(() => {
      expect(screen.getByText('test.xlsx')).toBeDefined();
    });
  });

  test('uploading an extra file overwrites previous upload', async () => {
    render(<UploadPage />);

    const firstMockFile = createMockFile('first-test.xlsx', 'test content');
    const secondMockFile = createMockFile('second-test.xlsx', 'test content');


    const fileInput = document.getElementById('file-upload') as HTMLInputElement;

    fireEvent.change(fileInput, { target: { files: createFileListMock(firstMockFile) } });

    await waitFor(() => {
        expect(screen.getByText(firstMockFile.name)).toBeDefined();
        expect(screen.queryByText(secondMockFile.name)).toBeNull();
      });

    fireEvent.change(fileInput, { target: { files: createFileListMock(secondMockFile) } });

    await waitFor(() => {
        expect(screen.queryByText(firstMockFile.name)).toBeNull();
        expect(screen.getByText(secondMockFile.name)).toBeDefined();
      });
  });


  test('user cannot upload file exceeding size limit', async () => {
    render(<UploadPage />);

    // Create a mock file that's larger than MAX_UPLOAD_SIZE (3MB)
    const largeMockFile = createMockFile('large-file.xlsx', 'test content');

    // Mock the file size to be larger than 3MB
    Object.defineProperty(largeMockFile, 'size', {
      value: 5 * 1024 * 1024, // 5MB
      writable: false
    });

    const fileInput = document.getElementById('file-upload') as HTMLInputElement;

    // Trigger file upload
    fireEvent.change(fileInput, { target: { files: createFileListMock(largeMockFile) } });

    // Wait a bit to ensure processing is complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify file does NOT appear in the UI
    expect(screen.queryByText('large-file.xlsx')).toBeNull();
  });
});
