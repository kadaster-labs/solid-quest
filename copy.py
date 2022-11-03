import os

srcFolderVerkoper = './solid-server-verkoper/data/koopovereenkomst/events/id'
srcFolderKoper = './solid-server-koper/data/koopovereenkomst/events/id'
srcGuid = '3c27a67c-ab1e-49cf-8e22-90f58e924e95'

guids = ['1169a7f6-aebc-4c0e-b69b-ba5f6530a72c',
        'f587c64e-d006-442c-9252-2d6ca21190af',
        '674b0ed0-6501-42c1-aa99-1d045030288d',
        '9b39855b-5c40-4635-b0e8-906cbddcbc23',
        'c572c5c8-2c84-4b5a-8eb2-630215eae840',
        '817f3528-aa93-45bd-8462-ee43837f8df4',
        '1bc24631-de10-42b1-8ffe-6c0509336dfa',
        '3dcf3747-185f-4862-a442-47de5e236fa9',
        'c2a70f99-1542-4dc7-a9eb-c055158041bc',
        '36cf9c26-c692-48ee-8802-c8979a66d2d4',
        '9b899c79-865b-4820-8583-0156fc4b1443',
        'a3dd7c4b-1572-4837-a9fc-46219b751495',
        '4f5e143b-e2df-4fe9-9770-99c6b5bd4054',
        '87ce3023-ed73-4054-91fb-943b47c98a1a']

verkoperGuids = guids[:7]
koperGuids = guids[7:]

print(f'last guid of verkoperGuids({len(verkoperGuids)}): {verkoperGuids[6]}')
print(f'first guid of koperGuids({len(koperGuids)}): {koperGuids[0]}')

def copyFiles(destFolder, guids):
    print(f'copying files into {destFolder}')
    print('reading file')
    aclSrcFile = open(f'{srcFolderVerkoper}/{srcGuid}.acl')
    ttlSrcFile = open(f'{srcFolderVerkoper}/{srcGuid}$.ttl')
    try:
        aclSrcContents = aclSrcFile.read()
        ttlSrcContents = ttlSrcFile.read()
    finally:
        aclSrcFile.close()
        ttlSrcFile.close()
    for guid in guids:
        aclDestFile = open(f'{destFolder}/{guid}.acl', 'x')
        ttlDestFile = open(f'{destFolder}/{guid}$.ttl', 'x')
        try:
            aclDestContents = aclSrcContents.replace(srcGuid, guid)
            print(f'writing file: {aclDestFile}')
            aclDestFile.write(aclDestContents)
            print(f'writing file: {ttlDestFile}')
            ttlDestFile.write(ttlSrcContents)
        finally:
            aclDestFile.close()
            ttlDestFile.close()

def cleanUp():
    temp1acl = map(lambda guid: f"{srcFolderVerkoper}/{guid}.acl", verkoperGuids)
    temp2acl = map(lambda guid: f"{srcFolderKoper}/{guid}.acl", koperGuids)
    aclFileList = list(temp1acl) + list(temp2acl)
    temp1ttl = map(lambda guid: f"{srcFolderVerkoper}/{guid}$.ttl", verkoperGuids)
    temp2ttl = map(lambda guid: f"{srcFolderKoper}/{guid}$.ttl", koperGuids)
    ttlFileList = list(temp1ttl) + list(temp2ttl)
    fileList = aclFileList + ttlFileList
    for f in fileList:
        if os.path.exists(f):
            os.remove(f)
            print(f'{f} deleted!')
        else:
            print(f'{f} not existant')

def printBreakline():
    print(''.join(list(map(lambda x: "-", [*range(80)]))))

printBreakline()

cleanUp()

printBreakline()

copyFiles(srcFolderVerkoper, verkoperGuids)
copyFiles(srcFolderKoper, koperGuids)
