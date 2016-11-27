@echo off
set build=b
set deploy=d
if "%1" == "%build%" (
	spm build
) else if "%1" == "%deploy%" (
	rd sea-modules\fare /s /q
	md sea-modules\fare
	md sea-modules\fare\oc
	md sea-modules\fare\oc\1.0.0
	md sea-modules\fare\oc\1.0.0\validate

	xcopy dist\*.* sea-modules\fare\oc\1.0.0
	xcopy dist\validate\*.* sea-modules\fare\oc\1.0.0\validate
) else (
	echo error command: b d
)